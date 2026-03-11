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

type clientRepo struct{ db *sql.DB }

func NewClientRepository(db *sql.DB) repository.ClientRepository { return &clientRepo{db} }

func (r *clientRepo) Create(ctx context.Context, c *entity.Client) error {
	return r.db.QueryRowContext(ctx,
		`INSERT INTO clients (id, first_name, last_name, birth_date, phone, email, address, active, created_at, updated_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
		 RETURNING created_at, updated_at`,
		c.ID, c.FirstName, c.LastName, c.BirthDate, c.Phone, c.Email, c.Address, c.Active, c.CreatedAt, c.UpdatedAt,
	).Scan(&c.CreatedAt, &c.UpdatedAt)
}

func (r *clientRepo) FindByID(ctx context.Context, id string) (*entity.Client, error) {
	c := &entity.Client{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, first_name, last_name, birth_date::TEXT, phone, email, address, active, created_at, updated_at
		 FROM clients WHERE id=$1`, id,
	).Scan(&c.ID, &c.FirstName, &c.LastName, &c.BirthDate, &c.Phone, &c.Email, &c.Address, &c.Active, &c.CreatedAt, &c.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	return c, err
}

func (r *clientRepo) List(ctx context.Context, f repository.ClientFilter, p repository.Page) (repository.Paginated[entity.Client], error) {
	where, args := []string{"1=1"}, []any{}
	n := 1

	if f.Search != "" {
		s := "%" + strings.ToLower(f.Search) + "%"
		where = append(where, fmt.Sprintf(
			"(LOWER(first_name||' '||last_name) LIKE $%d OR LOWER(email) LIKE $%d OR phone LIKE $%d)",
			n, n+1, n+2,
		))
		args = append(args, s, s, s)
		n += 3
	}
	if f.Status == "active" {
		where = append(where, "active=TRUE")
	} else if f.Status == "inactive" {
		where = append(where, "active=FALSE")
	}

	cond := strings.Join(where, " AND ")
	var total int
	if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM clients WHERE "+cond, args...).Scan(&total); err != nil {
		return repository.Paginated[entity.Client]{}, err
	}

	args = append(args, p.Limit, p.Offset())
	rows, err := r.db.QueryContext(ctx,
		fmt.Sprintf(`SELECT id, first_name, last_name, birth_date::TEXT, phone, email, address, active, created_at, updated_at
		 FROM clients WHERE %s ORDER BY created_at DESC LIMIT $%d OFFSET $%d`, cond, n, n+1),
		args...,
	)
	if err != nil {
		return repository.Paginated[entity.Client]{}, err
	}
	defer rows.Close()

	var items []entity.Client
	for rows.Next() {
		var c entity.Client
		if err := rows.Scan(&c.ID, &c.FirstName, &c.LastName, &c.BirthDate, &c.Phone, &c.Email, &c.Address, &c.Active, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return repository.Paginated[entity.Client]{}, err
		}
		items = append(items, c)
	}
	return repository.NewPaginated(items, total, p.Page, p.Limit), rows.Err()
}

func (r *clientRepo) Update(ctx context.Context, c *entity.Client) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE clients SET first_name=$1, last_name=$2, birth_date=$3, phone=$4, email=$5, address=$6, updated_at=NOW()
		 WHERE id=$7`,
		c.FirstName, c.LastName, c.BirthDate, c.Phone, c.Email, c.Address, c.ID,
	)
	return err
}

func (r *clientRepo) Deactivate(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, `UPDATE clients SET active=FALSE, updated_at=NOW() WHERE id=$1`, id)
	return err
}
