package entity

import "time"

// ── User ──────────────────────────────────────────────────────────────────────

type Role string

const (
	RoleAdmin   Role = "admin"
	RoleStaff   Role = "staff"
	RoleBilling Role = "billing"
)

type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         Role      `json:"role"`
	Active       bool      `json:"active"`
	CreatedAt    time.Time `json:"createdAt"`
}

// ── Client ────────────────────────────────────────────────────────────────────

type Client struct {
	ID        string    `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	BirthDate string    `json:"birthDate"` // YYYY-MM-DD
	Phone     string    `json:"phone"`
	Email     string    `json:"email"`
	Address   string    `json:"address"`
	Active    bool      `json:"active"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (c *Client) FullName() string { return c.FirstName + " " + c.LastName }

// ── MembershipPlan ────────────────────────────────────────────────────────────

type MembershipPlan struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	DurationDays  int     `json:"durationDays"`
	PriceStandard float64 `json:"priceStandard"`
	PriceStudent  float64 `json:"priceStudent"`
	Active        bool    `json:"active"`
}

// ── Membership ────────────────────────────────────────────────────────────────

type MembershipStatus string

const (
	MembershipActive    MembershipStatus = "active"
	MembershipExpired   MembershipStatus = "expired"
	MembershipCancelled MembershipStatus = "cancelled"
)

type PriceType string

const (
	PriceStandard PriceType = "standard"
	PriceStudent  PriceType = "student"
)

type Membership struct {
	ID        string           `json:"id"`
	ClientID  string           `json:"clientId"`
	PlanID    string           `json:"planId"`
	PlanName  string           `json:"planName"`
	PriceType PriceType        `json:"priceType"`
	Price     float64          `json:"price"`
	StartDate string           `json:"startDate"` // YYYY-MM-DD
	EndDate   string           `json:"endDate"`   // YYYY-MM-DD
	Status    MembershipStatus `json:"status"`
	CreatedBy string           `json:"createdBy"`
	CreatedAt time.Time        `json:"createdAt"`
}

// ── Payment ───────────────────────────────────────────────────────────────────

type PaymentMethod string

const (
	PaymentCash         PaymentMethod = "cash"
	PaymentCard         PaymentMethod = "card"
	PaymentBankTransfer PaymentMethod = "bank_transfer"
)

type Payment struct {
	ID           string        `json:"id"`
	ClientID     string        `json:"clientId"`
	MembershipID string        `json:"membershipId"`
	Amount       float64       `json:"amount"`
	Method       PaymentMethod `json:"method"`
	Reference    string        `json:"reference"`
	PaidAt       time.Time     `json:"paidAt"`
	CreatedBy    string        `json:"createdBy"`
}

// ── AuditLog ──────────────────────────────────────────────────────────────────

type AuditLog struct {
	ID         string    `json:"id"`
	UserID     string    `json:"userId"`
	UserName   string    `json:"userName,omitempty"`
	Action     string    `json:"action"`
	Entity     string    `json:"entity"`
	EntityID   string    `json:"entityId"`
	BeforeJSON string    `json:"beforeJson,omitempty"`
	AfterJSON  string    `json:"afterJson,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

type ExpiringMembership struct {
	ClientID     string `json:"clientId"`
	ClientName   string `json:"clientName"`
	MembershipID string `json:"membershipId"`
	EndDate      string `json:"endDate"`
	DaysLeft     int    `json:"daysLeft"`
}

type DashboardMetrics struct {
	ActiveMemberships   int                  `json:"activeMemberships"`
	ExpiringIn7Days     int                  `json:"expiringIn7Days"`
	RevenueToday        float64              `json:"revenueToday"`
	RevenueThisMonth    float64              `json:"revenueThisMonth"`
	UpcomingExpirations []ExpiringMembership `json:"upcomingExpirations"`
}

// ── Reports ───────────────────────────────────────────────────────────────────

type ExpirationReport struct {
	ClientID     string           `json:"clientId"`
	ClientName   string           `json:"clientName"`
	MembershipID string           `json:"membershipId"`
	EndDate      string           `json:"endDate"`
	DaysLeft     int              `json:"daysLeft"`
	Status       MembershipStatus `json:"status"`
}

type RevenueByMethod struct {
	Cash         float64 `json:"cash"`
	Card         float64 `json:"card"`
	BankTransfer float64 `json:"bank_transfer"`
}

type RevenueReport struct {
	Date     string          `json:"date"`
	Total    float64         `json:"total"`
	Count    int             `json:"count"`
	ByMethod RevenueByMethod `json:"byMethod"`
}
