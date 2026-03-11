package handler

import (
	"github.com/gin-gonic/gin"

	"chapitos/backend/internal/application"
	"chapitos/backend/internal/domain/repository"
)

type DashboardHandler struct{ svc *application.DashboardService }

func NewDashboardHandler(s *application.DashboardService) *DashboardHandler {
	return &DashboardHandler{svc: s}
}

func (h *DashboardHandler) Metrics(c *gin.Context) {
	m, err := h.svc.GetMetrics(c.Request.Context())
	if err != nil {
		internal(c, err.Error())
		return
	}
	ok(c, m)
}

func (h *DashboardHandler) ExpirationReport(c *gin.Context) {
	from, to := c.Query("from"), c.Query("to")
	if from == "" || to == "" {
		badRequest(c, "'from' and 'to' query params required (YYYY-MM-DD)")
		return
	}
	data, err := h.svc.ExpirationReport(c.Request.Context(), from, to)
	if err != nil {
		internal(c, err.Error())
		return
	}
	ok(c, data)
}

func (h *DashboardHandler) RevenueReport(c *gin.Context) {
	from, to := c.Query("from"), c.Query("to")
	if from == "" || to == "" {
		badRequest(c, "'from' and 'to' query params required (YYYY-MM-DD)")
		return
	}
	data, err := h.svc.RevenueReport(c.Request.Context(), from, to)
	if err != nil {
		internal(c, err.Error())
		return
	}
	ok(c, data)
}

func (h *DashboardHandler) ExportPDF(c *gin.Context) {
	reportType := c.Query("type")
	from, to := c.Query("from"), c.Query("to")
	if reportType == "" || from == "" || to == "" {
		badRequest(c, "'type', 'from' and 'to' are required")
		return
	}
	data, err := h.svc.ExportPDF(c.Request.Context(), reportType, from, to)
	if err != nil {
		internal(c, "Could not generate PDF")
		return
	}
	c.Header("Content-Disposition", "attachment; filename=report.pdf")
	c.Data(200, "application/pdf", data)
}

// AuditHandler handles audit log listing.
type AuditHandler struct{ audit repository.AuditRepository }

func NewAuditHandler(a repository.AuditRepository) *AuditHandler { return &AuditHandler{audit: a} }

func (h *AuditHandler) List(c *gin.Context) {
	page, limit := parsePage(c)
	filter := repository.AuditFilter{
		Entity:   c.Query("entity"),
		EntityID: c.Query("entityId"),
	}
	result, err := h.audit.List(c.Request.Context(), filter, repository.Page{Page: page, Limit: limit})
	if err != nil {
		internal(c, err.Error())
		return
	}
	ok(c, result)
}

// AdminHandler handles admin operations.
type AdminHandler struct{}

func NewAdminHandler() *AdminHandler { return &AdminHandler{} }

func (h *AdminHandler) TriggerReminders(c *gin.Context) {
	// TODO: integrate with actual email worker
	ok(c, gin.H{"message": "Reminder job triggered"})
}

func (h *AdminHandler) TriggerBackup(c *gin.Context) {
	// TODO: integrate with backup service
	ok(c, gin.H{"message": "Backup job triggered"})
}
