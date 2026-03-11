package database

import (
	"context"
	"database/sql"
	"errors"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

type userRepo struct{ db *sql.DB }

func NewUserRepository(db *sql.DB) repository.UserRepository { return &userRepo{db} }

func (r *userRepo) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	u := &entity.User{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, email, password_hash, role, active, created_at FROM users WHERE email=$1 AND active=TRUE`,
		email,
	).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Active, &u.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	return u, err
}

func (r *userRepo) FindByID(ctx context.Context, id string) (*entity.User, error) {
	u := &entity.User{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, email, password_hash, role, active, created_at FROM users WHERE id=$1`,
		id,
	).Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role, &u.Active, &u.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	return u, err
}
