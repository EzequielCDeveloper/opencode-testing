package database

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

type membershipPlanRepo struct{ db *sql.DB }

func NewMembershipPlanRepository(db *sql.DB) repository.MembershipPlanRepository {
	return &membershipPlanRepo{db}
}

func (r *membershipPlanRepo) FindByID(ctx context.Context, id string) (*entity.MembershipPlan, error) {
	p := &entity.MembershipPlan{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, duration_days, price_standard, price_student, active FROM membership_plans WHERE id=$1`, id,
	).Scan(&p.ID, &p.Name, &p.DurationDays, &p.PriceStandard, &p.PriceStudent, &p.Active)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	return p, err
}

func (r *membershipPlanRepo) ListActive(ctx context.Context) ([]entity.MembershipPlan, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, name, duration_days, price_standard, price_student, active FROM membership_plans WHERE active=TRUE`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var plans []entity.MembershipPlan
	for rows.Next() {
		var p entity.MembershipPlan
		if err := rows.Scan(&p.ID, &p.Name, &p.DurationDays, &p.PriceStandard, &p.PriceStudent, &p.Active); err != nil {
			return nil, err
		}
		plans = append(plans, p)
	}
	return plans, rows.Err()
}

// ─────────────────────────────────────────────────────────────────────────────

type membershipRepo struct{ db *sql.DB }

func NewMembershipRepository(db *sql.DB) repository.MembershipRepository { return &membershipRepo{db} }

func (r *membershipRepo) Create(ctx context.Context, m *entity.Membership) error {
	return r.db.QueryRowContext(ctx,
		`INSERT INTO memberships (id, client_id, plan_id, price_type, price, start_date, end_date, status, created_by, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING created_at`,
		m.ID, m.ClientID, m.PlanID, m.PriceType, m.Price, m.StartDate, m.EndDate, m.Status, m.CreatedBy, m.CreatedAt,
	).Scan(&m.CreatedAt)
}

func (r *membershipRepo) FindByID(ctx context.Context, id string) (*entity.Membership, error) {
	m := &entity.Membership{}
	err := r.db.QueryRowContext(ctx,
		`SELECT m.id, m.client_id, m.plan_id, p.name, m.price_type, m.price,
		        m.start_date::TEXT, m.end_date::TEXT, m.status, m.created_by, m.created_at
		 FROM memberships m JOIN membership_plans p ON p.id=m.plan_id WHERE m.id=$1`, id,
	).Scan(&m.ID, &m.ClientID, &m.PlanID, &m.PlanName, &m.PriceType, &m.Price,
		&m.StartDate, &m.EndDate, &m.Status, &m.CreatedBy, &m.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	return m, err
}

func (r *membershipRepo) List(ctx context.Context, f repository.MembershipFilter, p repository.Page) (repository.Paginated[entity.Membership], error) {
	where, args := []string{"1=1"}, []any{}
	n := 1

	if f.ClientID != "" {
		where = append(where, fmt.Sprintf("m.client_id=$%d", n))
		args = append(args, f.ClientID)
		n++
	}
	if f.Status != "" {
		where = append(where, fmt.Sprintf("m.status=$%d", n))
		args = append(args, f.Status)
		n++
	}

	cond := strings.Join(where, " AND ")
	var total int
	if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM memberships m WHERE "+cond, args...).Scan(&total); err != nil {
		return repository.Paginated[entity.Membership]{}, err
	}

	args = append(args, p.Limit, p.Offset())
	rows, err := r.db.QueryContext(ctx,
		fmt.Sprintf(`SELECT m.id, m.client_id, m.plan_id, p.name, m.price_type, m.price,
		        m.start_date::TEXT, m.end_date::TEXT, m.status, m.created_by, m.created_at
		 FROM memberships m JOIN membership_plans p ON p.id=m.plan_id
		 WHERE %s ORDER BY m.created_at DESC LIMIT $%d OFFSET $%d`, cond, n, n+1),
		args...,
	)
	if err != nil {
		return repository.Paginated[entity.Membership]{}, err
	}
	defer rows.Close()

	var items []entity.Membership
	for rows.Next() {
		var m entity.Membership
		if err := rows.Scan(&m.ID, &m.ClientID, &m.PlanID, &m.PlanName, &m.PriceType, &m.Price,
			&m.StartDate, &m.EndDate, &m.Status, &m.CreatedBy, &m.CreatedAt); err != nil {
			return repository.Paginated[entity.Membership]{}, err
		}
		items = append(items, m)
	}
	return repository.NewPaginated(items, total, p.Page, p.Limit), rows.Err()
}

func (r *membershipRepo) UpdateStatus(ctx context.Context, id string, status entity.MembershipStatus) error {
	_, err := r.db.ExecContext(ctx, `UPDATE memberships SET status=$1 WHERE id=$2`, status, id)
	return err
}

func (r *membershipRepo) FindExpiringBefore(ctx context.Context, date time.Time) ([]entity.Membership, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT m.id, m.client_id, m.plan_id, p.name, m.price_type, m.price,
		        m.start_date::TEXT, m.end_date::TEXT, m.status, m.created_by, m.created_at
		 FROM memberships m JOIN membership_plans p ON p.id=m.plan_id
		 WHERE m.status='active' AND m.end_date <= $1`, date.Format("2006-01-02"),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []entity.Membership
	for rows.Next() {
		var m entity.Membership
		if err := rows.Scan(&m.ID, &m.ClientID, &m.PlanID, &m.PlanName, &m.PriceType, &m.Price,
			&m.StartDate, &m.EndDate, &m.Status, &m.CreatedBy, &m.CreatedAt); err != nil {
			return nil, err
		}
		items = append(items, m)
	}
	return items, rows.Err()
}
