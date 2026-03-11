package application

import (
	"context"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
	"chapitos/backend/internal/infrastructure/pdf"
)

type DashboardService struct {
	dashboard repository.DashboardRepository
	reports   repository.ReportRepository
}

func NewDashboardService(d repository.DashboardRepository, r repository.ReportRepository) *DashboardService {
	return &DashboardService{dashboard: d, reports: r}
}

func (s *DashboardService) GetMetrics(ctx context.Context) (*entity.DashboardMetrics, error) {
	return s.dashboard.GetMetrics(ctx)
}

func (s *DashboardService) ExpirationReport(ctx context.Context, from, to string) ([]entity.ExpirationReport, error) {
	return s.reports.ExpirationReport(ctx, from, to)
}

func (s *DashboardService) RevenueReport(ctx context.Context, from, to string) ([]entity.RevenueReport, error) {
	return s.reports.RevenueReport(ctx, from, to)
}

func (s *DashboardService) ExportPDF(ctx context.Context, reportType, from, to string) ([]byte, error) {
	var data any
	var err error
	switch reportType {
	case "revenue":
		data, err = s.reports.RevenueReport(ctx, from, to)
	default:
		data, err = s.reports.ExpirationReport(ctx, from, to)
	}
	if err != nil {
		return nil, err
	}
	return pdf.GenerateReport(reportType, data, from, to)
}
