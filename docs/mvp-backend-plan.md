# Backend MVP Plan

## 1. Stack and Architecture

- Language: Go
- API: REST
- DB: PostgreSQL
- Architecture: Hexagonal Architecture
- Runtime: Docker on Ubuntu VPS

---

## 2. Backend Modules for MVP

1. Auth and Authorization
2. Client Management
3. Membership Management
4. Payments and Receipts
5. Notifications (email reminders)
6. Dashboard and Reports
7. Audit and Backups

---

## 3. Data Model (MVP)

## Core tables
- `users` (id, name, email, password_hash, role, active, created_at)
- `clients` (id, first_name, last_name, birth_date, phone, email, address, created_at, updated_at, active)
- `membership_plans` (id, name, duration_days, price_standard, price_student, active)
- `memberships` (id, client_id, plan_id, price_type, start_date, end_date, status, created_by, created_at)
- `payments` (id, client_id, membership_id, amount, payment_method, paid_at, reference, created_by)
- `receipts` (id, payment_id, receipt_number, pdf_path, issued_at)
- `notification_jobs` (id, client_id, membership_id, channel, send_at, status, attempts)
- `audit_logs` (id, user_id, action, entity, entity_id, before_json, after_json, created_at)

## Notes
- Membership status values: `active`, `expired`, `cancelled`.
- Payment methods: `cash`, `card`, `bank_transfer`.
- No partial payments and no refunds in MVP.

---

## 4. API Endpoints (MVP)

## Auth
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

## Clients
- `POST /api/v1/clients`
- `GET /api/v1/clients`
- `GET /api/v1/clients/{id}`
- `PUT /api/v1/clients/{id}`
- `PATCH /api/v1/clients/{id}/deactivate`

## Memberships
- `POST /api/v1/memberships`
- `GET /api/v1/memberships`
- `GET /api/v1/memberships/{id}`
- `PATCH /api/v1/memberships/{id}/status`

## Payments
- `POST /api/v1/payments`
- `GET /api/v1/payments`
- `GET /api/v1/payments/{id}`
- `GET /api/v1/payments/{id}/receipt`

## Dashboard and Reports
- `GET /api/v1/dashboard/metrics`
- `GET /api/v1/reports/expirations?from=&to=`
- `GET /api/v1/reports/revenue?from=&to=`
- `GET /api/v1/reports/export/pdf?type=`

## Admin/Ops
- `GET /api/v1/audit-logs`
- `POST /api/v1/admin/backup/run`

---

## 5. Backend Tasks and Deadlines

Target period: **2026-02-10 to 2026-04-09**

| ID | Task | Owner | Priority | Start | Due | Deliverable |
|---|---|---|---|---|---|---|
| BE-T01 | Project bootstrap (Go, Docker, env config) | Full-stack | P0 | 2026-02-10 | 2026-02-12 | Running API container + DB connection |
| BE-T02 | PostgreSQL schema + migrations | Full-stack | P0 | 2026-02-12 | 2026-02-16 | Versioned migrations for MVP tables |
| BE-T03 | Auth (login/session 12-16h) + RBAC | Full-stack | P0 | 2026-02-16 | 2026-02-21 | Secure auth + Admin/Staff/Billing permissions |
| BE-T04 | Client module CRUD + search | Full-stack | P0 | 2026-02-21 | 2026-02-27 | Client endpoints with validations |
| BE-T05 | Membership module (monthly plans only) | Full-stack | P0 | 2026-02-27 | 2026-03-05 | Assignment and status lifecycle |
| BE-T06 | Payment module + methods + constraints | Full-stack | P0 | 2026-03-05 | 2026-03-11 | Payment registration without partial/refund |
| BE-T07 | PDF receipt generation | Full-stack | P0 | 2026-03-11 | 2026-03-14 | Downloadable PDF receipt endpoint |
| BE-T08 | Email reminder worker (3 days before expiry) | Full-stack | P0 | 2026-03-14 | 2026-03-20 | Cron/worker + Gmail integration |
| BE-T09 | Dashboard and reporting endpoints | Full-stack | P0 | 2026-03-20 | 2026-03-25 | Metrics and PDF report export |
| BE-T10 | Audit trail implementation | Full-stack | P1 | 2026-03-25 | 2026-03-29 | Audit logs on critical mutations |
| BE-T11 | Daily automatic backup process | Full-stack | P1 | 2026-03-29 | 2026-04-02 | Scheduled backup job + restore check |
| BE-T12 | Testing hardening + bug fixes + release prep | Full-stack | P0 | 2026-04-02 | 2026-04-09 | MVP backend release candidate |

---

## 6. Backend Definition of Done

- Endpoint has request validation and standardized error response.
- Role permissions enforced at handler/service level.
- Unit/integration tests added for critical flows.
- Audit event logged for create/update/deactivate operations.
- Feature documented in API reference.
- Docker service builds and runs in VPS-like environment.
