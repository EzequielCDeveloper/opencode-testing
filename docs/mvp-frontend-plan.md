# Frontend MVP Plan

## 1. Stack and Approach

- Framework: Next.js
- Rendering approach: SSR where it improves first load and protected pages
- Architecture: Clean Architecture for UI/domain/infrastructure separation
- UI target: responsive desktop-first + mobile-compatible

---

## 2. Frontend Pages and Features (MVP)

## Auth
- Login page
- Session persistence for one workday
- Route guards by role

## Dashboard
- KPIs: active members, expiring memberships, revenue summary
- Upcoming expirations list

## Clients
- Client list with pagination and search
- Create/edit form with validation
- Client details page
- Deactivate client action

## Memberships
- Membership assignment flow (monthly)
- Status display (active/expired/cancelled)
- Student vs standard pricing selector

## Payments
- Record payment form (cash/card/bank transfer)
- Payment history by client
- Receipt download action

## Reports and Settings
- Report filters by date
- PDF export trigger and download
- Basic user profile/logout actions

---

## 3. Frontend Tasks and Deadlines

Target period: **2026-02-10 to 2026-04-09**

| ID | Task | Owner | Priority | Start | Due | Deliverable |
|---|---|---|---|---|---|---|
| FE-T01 | Next.js setup, layout, route structure, auth shell | Full-stack | P0 | 2026-02-10 | 2026-02-14 | Base app with protected routes |
| FE-T02 | Login page + session handling + role guards | Full-stack | P0 | 2026-02-14 | 2026-02-18 | Secure access flow |
| FE-T03 | Dashboard UI with backend metrics integration | Full-stack | P0 | 2026-02-18 | 2026-02-24 | Operational dashboard |
| FE-T04 | Client list/details/create/edit/deactivate UI | Full-stack | P0 | 2026-02-24 | 2026-03-03 | Full client management screens |
| FE-T05 | Membership assignment/status UI | Full-stack | P0 | 2026-03-03 | 2026-03-09 | Membership management screens |
| FE-T06 | Payment entry + payment history + receipt action | Full-stack | P0 | 2026-03-09 | 2026-03-15 | Billing workflow complete |
| FE-T07 | Report filters + PDF export views | Full-stack | P1 | 2026-03-15 | 2026-03-21 | Reports section usable by staff |
| FE-T08 | Form validation and UX hardening | Full-stack | P0 | 2026-03-21 | 2026-03-27 | Reliable forms and error states |
| FE-T09 | Responsive polish (tablet/mobile) | Full-stack | P0 | 2026-03-27 | 2026-04-01 | Mobile-compatible pages |
| FE-T10 | E2E smoke tests + bug fixes + release prep | Full-stack | P0 | 2026-04-01 | 2026-04-09 | MVP frontend release candidate |

---

## 4. UI/UX Rules for MVP

- Keep navigation simple: Dashboard, Clients, Memberships, Payments, Reports.
- Use clear status badges for membership and payment states.
- Surface errors with actionable messages (not generic failures).
- All critical forms must show required fields and inline validation.
- Keep actions auditable: show who performed key updates where possible.

---

## 5. Frontend Definition of Done

- Feature is responsive for desktop and mobile widths.
- Loading, empty, error, and success states are implemented.
- Role-based visibility is respected in menus and actions.
- Forms prevent invalid submission.
- API integration uses centralized client and typed contracts.
- Basic smoke test passes for each main module.
