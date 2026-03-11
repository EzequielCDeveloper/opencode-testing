package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"chapitos/backend/internal/application"
	"chapitos/backend/internal/config"
	"chapitos/backend/internal/infrastructure/database"
	"chapitos/backend/internal/infrastructure/http/handler"
	"chapitos/backend/internal/infrastructure/http/router"
)

func main() {
	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	// Run migrations
	_, filename, _, _ := runtime.Caller(0)
	migrationsDir := filepath.Join(filepath.Dir(filename), "..", "..", "migrations")
	if err := database.RunMigrations(db, migrationsDir); err != nil {
		log.Fatalf("migrations: %v", err)
	}

	// Repos
	userRepo := database.NewUserRepository(db)
	clientRepo := database.NewClientRepository(db)
	planRepo := database.NewMembershipPlanRepository(db)
	membershipRepo := database.NewMembershipRepository(db)
	paymentRepo := database.NewPaymentRepository(db)
	dashboardRepo := database.NewDashboardRepository(db)
	reportRepo := database.NewReportRepository(db)
	auditRepo := database.NewAuditRepository(db)

	// Services
	authSvc := application.NewAuthService(userRepo, cfg.JWTSecret, cfg.JWTHours)
	clientSvc := application.NewClientService(clientRepo, auditRepo)
	membershipSvc := application.NewMembershipService(membershipRepo, planRepo, auditRepo)
	paymentSvc := application.NewPaymentService(paymentRepo, clientRepo, membershipRepo, auditRepo)
	dashboardSvc := application.NewDashboardService(dashboardRepo, reportRepo)

	// Handlers
	h := router.Handlers{
		Auth:       handler.NewAuthHandler(authSvc),
		Client:     handler.NewClientHandler(clientSvc),
		Membership: handler.NewMembershipHandler(membershipSvc),
		Payment:    handler.NewPaymentHandler(paymentSvc),
		Dashboard:  handler.NewDashboardHandler(dashboardSvc),
		Audit:      handler.NewAuditHandler(auditRepo),
		Admin:      handler.NewAdminHandler(),
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      router.New(h, cfg.JWTSecret),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("🚀 Chapitos API listening on :%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("server shutdown: %v", err)
	}
	log.Println("Server stopped")
}
