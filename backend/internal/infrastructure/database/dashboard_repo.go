package database

import (
	"context"
	"database/sql"
	"time"

	"chapitos/backend/internal/domain/entity"
	"chapitos/backend/internal/domain/repository"
)

type dashboardRepo struct{ db *sql.DB }

func NewDashboardRepository(db *sql.DB) repository.DashboardRepository { return &dashboardRepo{db} }

func (r *dashboardRepo) GetMetrics(ctx context.Context) (*entity.DashboardMetrics, error) {
	m := &entity.DashboardMetrics{UpcomingExpirations: []entity.ExpiringMembership{}}

	// Active memberships count
	_ = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM memberships WHERE status='active'`).Scan(&m.ActiveMemberships)

	// Expiring in 7 days
	in7 := time.Now().AddDate(0, 0, 7).Format("2006-01-02")
	_ = r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM memberships WHERE status='active' AND end_date <= $1`, in7,
	).Scan(&m.ExpiringIn7Days)

	// Revenue today
	today := time.Now().Format("2006-01-02")
	var rev sql.NullFloat64
	_ = r.db.QueryRowContext(ctx,
		`SELECT COALESCE(SUM(amount),0) FROM payments WHERE paid_at::DATE = $1::DATE`, today,
	).Scan(&rev)
	m.RevenueToday = rev.Float64

	// Revenue this month
	firstOfMonth := time.Now().Format("2006-01-02")[:7] + "-01"
	_ = r.db.QueryRowContext(ctx,
		`SELECT COALESCE(SUM(amount),0) FROM payments WHERE paid_at >= $1`, firstOfMonth,
	).Scan(&rev)
	m.RevenueThisMonth = rev.Float64

	// Upcoming expirations (next 7 days, up to 10)
	rows, err := r.db.QueryContext(ctx,
		`SELECT m.id, m.client_id, c.first_name||' '||c.last_name, m.end_date::TEXT,
		        (m.end_date - CURRENT_DATE) AS days_left
		 FROM memberships m JOIN clients c ON c.id=m.client_id
		 WHERE m.status='active' AND m.end_date <= $1
		 ORDER BY m.end_date ASC LIMIT 10`, in7,
	)
	if err != nil {
		return m, nil
	}
	defer rows.Close()
	for rows.Next() {
		var e entity.ExpiringMembership
		if err := rows.Scan(&e.MembershipID, &e.ClientID, &e.ClientName, &e.EndDate, &e.DaysLeft); err != nil {
			continue
		}
		m.UpcomingExpirations = append(m.UpcomingExpirations, e)
	}
	return m, nil
}
