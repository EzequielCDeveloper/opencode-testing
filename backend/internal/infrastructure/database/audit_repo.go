package database

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

type auditRepo struct{ db *sql.DB }

func NewAuditRepository(db *sql.DB) repository.AuditRepository { return &auditRepo{db} }

func (r *auditRepo) Create(ctx context.Context, log *entity.AuditLog) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO audit_logs (id, user_id, action, entity, entity_id, before_json, after_json, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
		log.ID, log.UserID, log.Action, log.Entity, log.EntityID, log.BeforeJSON, log.AfterJSON, log.CreatedAt,
	)
	return err
}

func (r *auditRepo) List(ctx context.Context, f repository.AuditFilter, p repository.Page) (repository.Paginated[entity.AuditLog], error) {
	where, args := []string{"1=1"}, []any{}
	n := 1
	if f.Entity != "" {
		where = append(where, fmt.Sprintf("a.entity=$%d", n))
		args = append(args, f.Entity)
		n++
	}
	if f.EntityID != "" {
		where = append(where, fmt.Sprintf("a.entity_id=$%d", n))
		args = append(args, f.EntityID)
		n++
	}

	cond := strings.Join(where, " AND ")
	var total int
	if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM audit_logs a WHERE "+cond, args...).Scan(&total); err != nil {
		return repository.Paginated[entity.AuditLog]{}, err
	}

	args = append(args, p.Limit, p.Offset())
	rows, err := r.db.QueryContext(ctx,
		fmt.Sprintf(`SELECT a.id, a.user_id, COALESCE(u.name,''), a.action, a.entity, a.entity_id,
		        a.before_json, a.after_json, a.created_at
		 FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id
		 WHERE %s ORDER BY a.created_at DESC LIMIT $%d OFFSET $%d`, cond, n, n+1),
		args...,
	)
	if err != nil {
		return repository.Paginated[entity.AuditLog]{}, err
	}
	defer rows.Close()

	var items []entity.AuditLog
	for rows.Next() {
		var l entity.AuditLog
		if err := rows.Scan(&l.ID, &l.UserID, &l.UserName, &l.Action, &l.Entity, &l.EntityID,
			&l.BeforeJSON, &l.AfterJSON, &l.CreatedAt); err != nil {
			return repository.Paginated[entity.AuditLog]{}, err
		}
		items = append(items, l)
	}
	if items == nil {
		items = []entity.AuditLog{}
	}
	return repository.NewPaginated(items, total, p.Page, p.Limit), rows.Err()
}
