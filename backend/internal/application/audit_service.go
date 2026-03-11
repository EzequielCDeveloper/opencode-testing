package application

import (
	"context"

	"chapitos/backend/internal/domain/repository"
)

type AuditService struct {
	audit repository.AuditRepository
}

func NewAuditService(a repository.AuditRepository) *AuditService {
	return &AuditService{audit: a}
}

func (s *AuditService) List(ctx context.Context, f repository.AuditFilter, page, limit int) (repository.Paginated[interface{}], error) {
	result, err := s.audit.List(ctx, f, repository.Page{Page: page, Limit: limit})
	if err != nil {
		return repository.Paginated[interface{}]{}, err
	}
	// convert to interface{} paginated
	items := make([]interface{}, len(result.Items))
	for i, item := range result.Items {
		items[i] = item
	}
	return repository.Paginated[interface{}]{
		Items:      items,
		Total:      result.Total,
		Page:       result.Page,
		Limit:      result.Limit,
		TotalPages: result.TotalPages,
	}, nil
}
