package application

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

var ErrClientNotFound = errors.New("client not found")

type ClientService struct {
	clients repository.ClientRepository
	audit   repository.AuditRepository
}

func NewClientService(c repository.ClientRepository, a repository.AuditRepository) *ClientService {
	return &ClientService{clients: c, audit: a}
}

type CreateClientInput struct {
	FirstName, LastName, BirthDate, Phone, Email, Address, ActorID string
}

func (s *ClientService) Create(ctx context.Context, in CreateClientInput) (*entity.Client, error) {
	now := time.Now()
	c := &entity.Client{
		ID:        uuid.New().String(),
		FirstName: in.FirstName,
		LastName:  in.LastName,
		BirthDate: in.BirthDate,
		Phone:     in.Phone,
		Email:     in.Email,
		Address:   in.Address,
		Active:    true,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := s.clients.Create(ctx, c); err != nil {
		return nil, err
	}
	writeAudit(ctx, s.audit, in.ActorID, "CREATE", "client", c.ID)
	return c, nil
}

func (s *ClientService) GetByID(ctx context.Context, id string) (*entity.Client, error) {
	c, err := s.clients.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if c == nil {
		return nil, ErrClientNotFound
	}
	return c, nil
}

func (s *ClientService) List(ctx context.Context, f repository.ClientFilter, page, limit int) (repository.Paginated[entity.Client], error) {
	return s.clients.List(ctx, f, repository.Page{Page: page, Limit: limit})
}

type UpdateClientInput struct {
	FirstName, LastName, BirthDate, Phone, Email, Address, ActorID string
}

func (s *ClientService) Update(ctx context.Context, id string, in UpdateClientInput) (*entity.Client, error) {
	c, err := s.clients.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if c == nil {
		return nil, ErrClientNotFound
	}
	c.FirstName = in.FirstName
	c.LastName = in.LastName
	c.BirthDate = in.BirthDate
	c.Phone = in.Phone
	c.Email = in.Email
	c.Address = in.Address
	if err := s.clients.Update(ctx, c); err != nil {
		return nil, err
	}
	writeAudit(ctx, s.audit, in.ActorID, "UPDATE", "client", id)
	return c, nil
}

func (s *ClientService) Deactivate(ctx context.Context, id, actorID string) (*entity.Client, error) {
	c, err := s.clients.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if c == nil {
		return nil, ErrClientNotFound
	}
	if err := s.clients.Deactivate(ctx, id); err != nil {
		return nil, err
	}
	writeAudit(ctx, s.audit, actorID, "DEACTIVATE", "client", id)
	c.Active = false
	return c, nil
}
