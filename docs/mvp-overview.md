# MVP Documentation - Gym Membership Management (Chapitos)

## 1. Goal

Deliver a production-ready MVP in 2 months for internal gym staff to manage clients, memberships, and payments, with automatic email reminders before membership expiration.

Target launch date: **2026-04-09**

---

## 2. Confirmed Business Rules (from `docs/questions.md`)

### Membership
- Membership model for MVP: **monthly only**.
- Price rules: **standard price** and **student price**.
- No grace period after expiration.
- No membership freeze/pause.
- Referral support required (basic tracking for discount eligibility).

### Users and Roles
- Employees can view all clients.
- Trainers cannot view client progress/payment history.
- Billing-only staff role is required.
- Single location only (no multi-location for MVP).
- No client self-service portal in MVP.

### Payments
- Payment methods: cash, card, bank transfer.
- No partial payments.
- No refunds.
- Receipts are required.

### Notifications
- Channel: email only.
- Schedule: 3 days before expiration.
- Reminder execution: automated.

### Data and Operations
- Existing data migration: paper to digital.
- Email provider: Google.
- Reports and PDF export required.
- Daily automatic backups required.
- Audit trail required for changes.

### Technical Constraints
- Offline mode not required.
- Session duration: 12-16 hours (working day).
- API is internal only (no third-party integrations in MVP).
- Team: single full-stack freelance developer.
- Hosting: VPS (Ubuntu + Docker + Cloudflare).

---

## 3. MVP Scope

### Included in MVP
- Authentication and role-based access (Admin, Staff, Billing).
- Client management (create, list, edit, view detail, deactivate).
- Membership management (monthly plan assignment, status tracking, pricing type).
- Payment recording and payment history.
- Receipt generation (PDF).
- Expiration reminder automation by email (3 days before).
- Dashboard with core metrics.
- Audit logging and daily backups.

### Excluded from MVP (Future)
- Membership freeze.
- Grace periods.
- Partial payments and refunds.
- Online payment gateway.
- Client portal.
- Multi-location support.
- SMS/WhatsApp/push notifications.

---

## 4. MVP Success Criteria

- Staff can register and manage clients end-to-end without spreadsheets.
- Every active client has one active monthly membership.
- Payments are recorded with method and receipt generated.
- System automatically sends expiration reminders 3 days before due date.
- Admin can export operational reports to PDF.
- Audit trail exists for critical changes (client, membership, payment, user actions).
- Daily backup job executes successfully.

---

## 5. Priority Features (MVP)

| Priority | Area | Feature |
|---|---|---|
| P0 | Auth | Login, JWT/session, role permissions |
| P0 | Clients | CRUD + list/search |
| P0 | Memberships | Assign monthly membership + status |
| P0 | Payments | Record payment + history + receipt PDF |
| P0 | Notifications | Automated email reminder (3 days before expiry) |
| P0 | Dashboard | Active members, expiring soon, revenue snapshot |
| P1 | Operations | Daily backup + activity/audit log |
| P1 | Reporting | PDF report exports |
