package database

import (
	"context"
	"database/sql"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

type reportRepo struct{ db *sql.DB }

func NewReportRepository(db *sql.DB) repository.ReportRepository { return &reportRepo{db} }

func (r *reportRepo) ExpirationReport(ctx context.Context, from, to string) ([]entity.ExpirationReport, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT m.id, m.client_id, c.first_name||' '||c.last_name, m.end_date::TEXT,
		        (m.end_date - CURRENT_DATE) AS days_left, m.status
		 FROM memberships m JOIN clients c ON c.id=m.client_id
		 WHERE m.end_date BETWEEN $1 AND $2
		 ORDER BY m.end_date ASC`, from, to,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []entity.ExpirationReport
	for rows.Next() {
		var e entity.ExpirationReport
		if err := rows.Scan(&e.MembershipID, &e.ClientID, &e.ClientName, &e.EndDate, &e.DaysLeft, &e.Status); err != nil {
			return nil, err
		}
		items = append(items, e)
	}
	if items == nil {
		items = []entity.ExpirationReport{}
	}
	return items, rows.Err()
}

func (r *reportRepo) RevenueReport(ctx context.Context, from, to string) ([]entity.RevenueReport, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT paid_at::DATE::TEXT AS date,
		        COALESCE(SUM(amount),0) AS total,
		        COUNT(*) AS cnt,
		        COALESCE(SUM(CASE WHEN method='cash' THEN amount ELSE 0 END),0) AS cash,
		        COALESCE(SUM(CASE WHEN method='card' THEN amount ELSE 0 END),0) AS card,
		        COALESCE(SUM(CASE WHEN method='bank_transfer' THEN amount ELSE 0 END),0) AS bank_transfer
		 FROM payments
		 WHERE paid_at::DATE BETWEEN $1::DATE AND $2::DATE
		 GROUP BY paid_at::DATE::TEXT
		 ORDER BY date ASC`, from, to,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []entity.RevenueReport
	for rows.Next() {
		var rv entity.RevenueReport
		if err := rows.Scan(&rv.Date, &rv.Total, &rv.Count,
			&rv.ByMethod.Cash, &rv.ByMethod.Card, &rv.ByMethod.BankTransfer); err != nil {
			return nil, err
		}
		items = append(items, rv)
	}
	if items == nil {
		items = []entity.RevenueReport{}
	}
	return items, rows.Err()
}
