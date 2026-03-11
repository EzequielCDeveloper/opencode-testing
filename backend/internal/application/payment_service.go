package application

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
	"chapitos/backend/internal/infrastructure/pdf"
)

var ErrPaymentNotFound = errors.New("payment not found")

type PaymentService struct {
	payments    repository.PaymentRepository
	clients     repository.ClientRepository
	memberships repository.MembershipRepository
	audit       repository.AuditRepository
}

func NewPaymentService(
	p repository.PaymentRepository,
	c repository.ClientRepository,
	m repository.MembershipRepository,
	a repository.AuditRepository,
) *PaymentService {
	return &PaymentService{payments: p, clients: c, memberships: m, audit: a}
}

type CreatePaymentInput struct {
	ClientID     string
	MembershipID string
	Amount       float64
	Method       entity.PaymentMethod
	Reference    string
	ActorID      string
}

func (s *PaymentService) Create(ctx context.Context, in CreatePaymentInput) (*entity.Payment, error) {
	p := &entity.Payment{
		ID:           uuid.New().String(),
		ClientID:     in.ClientID,
		MembershipID: in.MembershipID,
		Amount:       in.Amount,
		Method:       in.Method,
		Reference:    in.Reference,
		PaidAt:       time.Now(),
		CreatedBy:    in.ActorID,
	}
	if err := s.payments.Create(ctx, p); err != nil {
		return nil, err
	}
	writeAudit(ctx, s.audit, in.ActorID, "CREATE", "payment", p.ID)
	return p, nil
}

func (s *PaymentService) GetByID(ctx context.Context, id string) (*entity.Payment, error) {
	p, err := s.payments.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, ErrPaymentNotFound
	}
	return p, nil
}

func (s *PaymentService) List(ctx context.Context, f repository.PaymentFilter, page, limit int) (repository.Paginated[entity.Payment], error) {
	return s.payments.List(ctx, f, repository.Page{Page: page, Limit: limit})
}

func (s *PaymentService) GenerateReceipt(ctx context.Context, paymentID string) ([]byte, error) {
	payment, err := s.payments.FindByID(ctx, paymentID)
	if err != nil {
		return nil, err
	}
	if payment == nil {
		return nil, ErrPaymentNotFound
	}
	client, err := s.clients.FindByID(ctx, payment.ClientID)
	if err != nil {
		return nil, err
	}
	if client == nil {
		return nil, ErrClientNotFound
	}
	return pdf.GenerateReceipt(payment, client)
}
