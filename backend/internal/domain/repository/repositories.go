package repository

import (
	"context"
	"time"

	"chapitos/backend/internal/domain/entity"
)

// ── Pagination ────────────────────────────────────────────────────────────────

type Page struct {
	Page  int
	Limit int
}

func (p Page) Offset() int {
	if p.Page < 1 {
		p.Page = 1
	}
	return (p.Page - 1) * p.Limit
}

type Paginated[T any] struct {
	Items      []T `json:"items"`
	Total      int `json:"total"`
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	TotalPages int `json:"totalPages"`
}

func NewPaginated[T any](items []T, total, page, limit int) Paginated[T] {
	tp := (total + limit - 1) / limit
	if tp < 1 {
		tp = 1
	}
	if items == nil {
		items = []T{}
	}
	return Paginated[T]{Items: items, Total: total, Page: page, Limit: limit, TotalPages: tp}
}

// ── User ──────────────────────────────────────────────────────────────────────

type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
	FindByID(ctx context.Context, id string) (*entity.User, error)
}

// ── Client ────────────────────────────────────────────────────────────────────

type ClientFilter struct {
	Search string
	Status string // "active" | "inactive" | ""
}

type ClientRepository interface {
	Create(ctx context.Context, c *entity.Client) error
	FindByID(ctx context.Context, id string) (*entity.Client, error)
	List(ctx context.Context, f ClientFilter, p Page) (Paginated[entity.Client], error)
	Update(ctx context.Context, c *entity.Client) error
	Deactivate(ctx context.Context, id string) error
}

// ── MembershipPlan ────────────────────────────────────────────────────────────

type MembershipPlanRepository interface {
	FindByID(ctx context.Context, id string) (*entity.MembershipPlan, error)
	ListActive(ctx context.Context) ([]entity.MembershipPlan, error)
}

// ── Membership ────────────────────────────────────────────────────────────────

type MembershipFilter struct {
	ClientID string
	Status   string
}

type MembershipRepository interface {
	Create(ctx context.Context, m *entity.Membership) error
	FindByID(ctx context.Context, id string) (*entity.Membership, error)
	List(ctx context.Context, f MembershipFilter, p Page) (Paginated[entity.Membership], error)
	UpdateStatus(ctx context.Context, id string, status entity.MembershipStatus) error
	FindExpiringBefore(ctx context.Context, date time.Time) ([]entity.Membership, error)
}

// ── Payment ───────────────────────────────────────────────────────────────────

type PaymentFilter struct {
	ClientID string
	From     *time.Time
	To       *time.Time
}

type PaymentRepository interface {
	Create(ctx context.Context, p *entity.Payment) error
	FindByID(ctx context.Context, id string) (*entity.Payment, error)
	List(ctx context.Context, f PaymentFilter, p Page) (Paginated[entity.Payment], error)
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

type DashboardRepository interface {
	GetMetrics(ctx context.Context) (*entity.DashboardMetrics, error)
}

// ── Reports ───────────────────────────────────────────────────────────────────

type ReportRepository interface {
	ExpirationReport(ctx context.Context, from, to string) ([]entity.ExpirationReport, error)
	RevenueReport(ctx context.Context, from, to string) ([]entity.RevenueReport, error)
}

// ── AuditLog ──────────────────────────────────────────────────────────────────

type AuditFilter struct {
	Entity   string
	EntityID string
}

type AuditRepository interface {
	Create(ctx context.Context, log *entity.AuditLog) error
	List(ctx context.Context, f AuditFilter, p Page) (Paginated[entity.AuditLog], error)
}
