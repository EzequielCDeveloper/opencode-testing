package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/cors"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/infrastructure/http/handler"
	"chapitos/backend/internal/infrastructure/http/middleware"
)

type Handlers struct {
	Auth       *handler.AuthHandler
	Client     *handler.ClientHandler
	Membership *handler.MembershipHandler
	Payment    *handler.PaymentHandler
	Dashboard  *handler.DashboardHandler
	Audit      *handler.AuditHandler
	Admin      *handler.AdminHandler
}

func New(h Handlers, jwtSecret string) http.Handler {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	// Health
	r.GET("/health", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) })

	v1 := r.Group("/api/v1")

	// ── Auth (public) ─────────────────────────────────────────
	auth := v1.Group("/auth")
	auth.POST("/login", h.Auth.Login)

	// ── Protected routes ──────────────────────────────────────
	protected := v1.Group("")
	protected.Use(middleware.Auth(jwtSecret))

	protected.POST("/auth/logout", h.Auth.Logout)
	protected.GET("/auth/me", h.Auth.Me)

	// Clients
	allRoles := middleware.RequireRole(entity.RoleAdmin, entity.RoleStaff, entity.RoleBilling)
	staffAdmin := middleware.RequireRole(entity.RoleAdmin, entity.RoleStaff)

	clients := protected.Group("/clients")
	clients.GET("", allRoles, h.Client.List)
	clients.GET("/:clientId", allRoles, h.Client.Get)
	clients.POST("", staffAdmin, h.Client.Create)
	clients.PUT("/:clientId", staffAdmin, h.Client.Update)
	clients.PATCH("/:clientId/deactivate", staffAdmin, h.Client.Deactivate)

	// Memberships
	memberships := protected.Group("/memberships")
	memberships.GET("", allRoles, h.Membership.List)
	memberships.GET("/:membershipId", allRoles, h.Membership.Get)
	memberships.POST("", staffAdmin, h.Membership.Create)
	memberships.PATCH("/:membershipId/status", staffAdmin, h.Membership.UpdateStatus)

	// Payments
	billingAdmin := middleware.RequireRole(entity.RoleAdmin, entity.RoleBilling)
	payments := protected.Group("/payments")
	payments.GET("", allRoles, h.Payment.List)
	payments.GET("/:paymentId", allRoles, h.Payment.Get)
	payments.GET("/:paymentId/receipt", allRoles, h.Payment.Receipt)
	payments.POST("", billingAdmin, h.Payment.Create)

	// Dashboard & Reports
	staffAdminBilling := middleware.RequireRole(entity.RoleAdmin, entity.RoleStaff, entity.RoleBilling)
	protected.GET("/dashboard/metrics", middleware.RequireRole(entity.RoleAdmin, entity.RoleStaff), h.Dashboard.Metrics)
	protected.GET("/reports/expirations", staffAdminBilling, h.Dashboard.ExpirationReport)
	protected.GET("/reports/revenue", staffAdminBilling, h.Dashboard.RevenueReport)
	protected.GET("/reports/export/pdf", staffAdminBilling, h.Dashboard.ExportPDF)

	// Admin
	adminOnly := middleware.RequireRole(entity.RoleAdmin)
	protected.GET("/audit-logs", adminOnly, h.Audit.List)
	protected.POST("/admin/notifications/reminders/run", adminOnly, h.Admin.TriggerReminders)
	protected.POST("/admin/backup/run", adminOnly, h.Admin.TriggerBackup)

	// CORS wrapper
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: false,
	})
	return c.Handler(r)
}
