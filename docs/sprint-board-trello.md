# MVP Sprint Board (Trello Style)

## Board Setup

- Board name: `Chapitos Gym - MVP Delivery`
- Timeline: `2026-02-10` to `2026-04-09` (8 weeks)
- Sprint cadence: 4 sprints (2 weeks each)
- Lists per sprint board:
  - `Backlog`
  - `This Sprint`
  - `In Progress`
  - `Blocked`
  - `Review/QA`
  - `Done`

---

## Labels

- `backend`
- `frontend`
- `devops`
- `bug`
- `high-priority`
- `needs-review`
- `blocked`

---

## Sprint 1 (2026-02-10 to 2026-02-23)

## This Sprint cards

1. `BE-T01` - Bootstrap Go API + Docker + env setup
   - Labels: `backend`, `devops`, `high-priority`
   - Checklist:
     - Docker compose for API + PostgreSQL
     - Environment variable template
     - Health endpoint
   - Due: `2026-02-12`

2. `BE-T02` - PostgreSQL schema + migrations
   - Labels: `backend`, `high-priority`
   - Checklist:
     - Core MVP tables
     - Migration runner
     - Seed admin user
   - Due: `2026-02-16`

3. `FE-T01` - Next.js setup + route skeleton
   - Labels: `frontend`, `high-priority`
   - Checklist:
     - Base layout and navigation shell
     - Protected route pattern
     - API client foundation
   - Due: `2026-02-14`

4. `BE-T03` - Auth + RBAC (Admin, Staff, Billing)
   - Labels: `backend`, `high-priority`
   - Checklist:
     - Login endpoint
     - Token/session policy (12-16h)
     - Role middleware
   - Due: `2026-02-21`

5. `FE-T02` - Login page + session handling + guards
   - Labels: `frontend`, `high-priority`
   - Due: `2026-02-18`

6. `FE-T03` - Dashboard MVP UI + metrics integration
   - Labels: `frontend`
   - Due: `2026-02-24`

---

## Sprint 2 (2026-02-24 to 2026-03-09)

## This Sprint cards

1. `BE-T04` - Client module CRUD + search
   - Labels: `backend`, `high-priority`
   - Due: `2026-02-27`

2. `FE-T04` - Client list/details/create/edit/deactivate UI
   - Labels: `frontend`, `high-priority`
   - Due: `2026-03-03`

3. `BE-T05` - Membership assignment + status lifecycle
   - Labels: `backend`, `high-priority`
   - Due: `2026-03-05`

4. `FE-T05` - Membership assignment/status UI
   - Labels: `frontend`, `high-priority`
   - Due: `2026-03-09`

5. `BE-T06` - Payment registration (no partial/refunds)
   - Labels: `backend`, `high-priority`
   - Due: `2026-03-11`

---

## Sprint 3 (2026-03-10 to 2026-03-23)

## This Sprint cards

1. `FE-T06` - Payment UI + payment history + receipt action
   - Labels: `frontend`, `high-priority`
   - Due: `2026-03-15`

2. `BE-T07` - PDF receipt generation endpoint
   - Labels: `backend`, `high-priority`
   - Due: `2026-03-14`

3. `BE-T08` - Email reminder worker (3 days before expiration)
   - Labels: `backend`, `high-priority`
   - Due: `2026-03-20`

4. `BE-T09` - Dashboard + report endpoints
   - Labels: `backend`, `high-priority`
   - Due: `2026-03-25`

5. `FE-T07` - Report filters + PDF export UI
   - Labels: `frontend`
   - Due: `2026-03-21`

---

## Sprint 4 (2026-03-24 to 2026-04-09)

## This Sprint cards

1. `BE-T10` - Audit trail implementation
   - Labels: `backend`
   - Due: `2026-03-29`

2. `BE-T11` - Daily backup automation + restore validation
   - Labels: `backend`, `devops`
   - Due: `2026-04-02`

3. `FE-T08` - Form validation + UX hardening
   - Labels: `frontend`, `high-priority`
   - Due: `2026-03-27`

4. `FE-T09` - Responsive polish (tablet/mobile)
   - Labels: `frontend`
   - Due: `2026-04-01`

5. `BE-T12` - Backend hardening + release prep
   - Labels: `backend`, `needs-review`
   - Due: `2026-04-09`

6. `FE-T10` - Frontend E2E smoke tests + release prep
   - Labels: `frontend`, `needs-review`
   - Due: `2026-04-09`

---

## Trello Card Template

Use this template when creating each card:

```text
Title: [ID] Short action-oriented title
Description:
- Business outcome
- Scope in/out
- Dependencies

Checklist:
- Task 1
- Task 2
- Task 3

Definition of Done:
- Code complete
- QA passed
- Docs updated

Due date: YYYY-MM-DD
Labels: backend/frontend/devops/high-priority/etc.
Members: Full-stack developer
```
