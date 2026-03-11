package application

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

var (
	ErrMembershipNotFound = errors.New("membership not found")
	ErrPlanNotFound       = errors.New("membership plan not found")
)

type MembershipService struct {
	memberships repository.MembershipRepository
	plans       repository.MembershipPlanRepository
	audit       repository.AuditRepository
}

func NewMembershipService(m repository.MembershipRepository, p repository.MembershipPlanRepository, a repository.AuditRepository) *MembershipService {
	return &MembershipService{memberships: m, plans: p, audit: a}
}

type CreateMembershipInput struct {
	ClientID  string
	PlanID    string
	PriceType entity.PriceType
	StartDate string // YYYY-MM-DD
	ActorID   string
}

func (s *MembershipService) Create(ctx context.Context, in CreateMembershipInput) (*entity.Membership, error) {
	plan, err := s.plans.FindByID(ctx, in.PlanID)
	if err != nil {
		return nil, err
	}
	if plan == nil {
		return nil, ErrPlanNotFound
	}

	start, err := time.Parse("2006-01-02", in.StartDate)
	if err != nil {
		return nil, fmt.Errorf("invalid start date: %w", err)
	}
	end := start.AddDate(0, 0, plan.DurationDays)

	price := plan.PriceStandard
	if in.PriceType == entity.PriceStudent {
		price = plan.PriceStudent
	}

	m := &entity.Membership{
		ID:        uuid.New().String(),
		ClientID:  in.ClientID,
		PlanID:    in.PlanID,
		PlanName:  plan.Name,
		PriceType: in.PriceType,
		Price:     price,
		StartDate: start.Format("2006-01-02"),
		EndDate:   end.Format("2006-01-02"),
		Status:    entity.MembershipActive,
		CreatedBy: in.ActorID,
		CreatedAt: time.Now(),
	}
	if err := s.memberships.Create(ctx, m); err != nil {
		return nil, err
	}
	writeAudit(ctx, s.audit, in.ActorID, "CREATE", "membership", m.ID)
	return m, nil
}

func (s *MembershipService) GetByID(ctx context.Context, id string) (*entity.Membership, error) {
	m, err := s.memberships.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if m == nil {
		return nil, ErrMembershipNotFound
	}
	return m, nil
}

func (s *MembershipService) List(ctx context.Context, f repository.MembershipFilter, page, limit int) (repository.Paginated[entity.Membership], error) {
	return s.memberships.List(ctx, f, repository.Page{Page: page, Limit: limit})
}

func (s *MembershipService) UpdateStatus(ctx context.Context, id string, status entity.MembershipStatus, actorID string) (*entity.Membership, error) {
	m, err := s.memberships.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if m == nil {
		return nil, ErrMembershipNotFound
	}
	if err := s.memberships.UpdateStatus(ctx, id, status); err != nil {
		return nil, err
	}
	writeAudit(ctx, s.audit, actorID, "UPDATE_STATUS", "membership", id)
	m.Status = status
	return m, nil
}
