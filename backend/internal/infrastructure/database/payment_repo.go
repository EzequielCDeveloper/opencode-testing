package database

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

type paymentRepo struct{ db *sql.DB }

func NewPaymentRepository(db *sql.DB) repository.PaymentRepository { return &paymentRepo{db} }

func (r *paymentRepo) Create(ctx context.Context, p *entity.Payment) error {
	return r.db.QueryRowContext(ctx,
		`INSERT INTO payments (id, client_id, membership_id, amount, method, reference, paid_at, created_by)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING paid_at`,
		p.ID, p.ClientID, p.MembershipID, p.Amount, p.Method, p.Reference, p.PaidAt, p.CreatedBy,
	).Scan(&p.PaidAt)
}

func (r *paymentRepo) FindByID(ctx context.Context, id string) (*entity.Payment, error) {
	p := &entity.Payment{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, client_id, membership_id, amount, method, reference, paid_at, created_by
		 FROM payments WHERE id=$1`, id,
	).Scan(&p.ID, &p.ClientID, &p.MembershipID, &p.Amount, &p.Method, &p.Reference, &p.PaidAt, &p.CreatedBy)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	return p, err
}

func (r *paymentRepo) List(ctx context.Context, f repository.PaymentFilter, p repository.Page) (repository.Paginated[entity.Payment], error) {
	where, args := []string{"1=1"}, []any{}
	n := 1

	if f.ClientID != "" {
		where = append(where, fmt.Sprintf("client_id=$%d", n))
		args = append(args, f.ClientID)
		n++
	}
	if f.From != nil {
		where = append(where, fmt.Sprintf("paid_at >= $%d", n))
		args = append(args, *f.From)
		n++
	}
	if f.To != nil {
		where = append(where, fmt.Sprintf("paid_at <= $%d", n))
		args = append(args, *f.To)
		n++
	}

	cond := strings.Join(where, " AND ")
	var total int
	if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM payments WHERE "+cond, args...).Scan(&total); err != nil {
		return repository.Paginated[entity.Payment]{}, err
	}

	args = append(args, p.Limit, p.Offset())
	rows, err := r.db.QueryContext(ctx,
		fmt.Sprintf(`SELECT id, client_id, membership_id, amount, method, reference, paid_at, created_by
		 FROM payments WHERE %s ORDER BY paid_at DESC LIMIT $%d OFFSET $%d`, cond, n, n+1),
		args...,
	)
	if err != nil {
		return repository.Paginated[entity.Payment]{}, err
	}
	defer rows.Close()

	var items []entity.Payment
	for rows.Next() {
		var pay entity.Payment
		if err := rows.Scan(&pay.ID, &pay.ClientID, &pay.MembershipID, &pay.Amount, &pay.Method,
			&pay.Reference, &pay.PaidAt, &pay.CreatedBy); err != nil {
			return repository.Paginated[entity.Payment]{}, err
		}
		items = append(items, pay)
	}
	return repository.NewPaginated(items, total, p.Page, p.Limit), rows.Err()
}
