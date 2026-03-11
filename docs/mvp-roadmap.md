# MVP Roadmap, Tasks, and Deadlines

## Timeline

- Start: **2026-02-10**
- Target launch: **2026-04-09**
- Duration: **8 weeks**

---

## Weekly Plan

| Week | Dates | Focus | Outputs |
|---|---|---|---|
| Week 1 | 2026-02-10 to 2026-02-16 | Foundations | Project setup, DB schema, auth base |
| Week 2 | 2026-02-17 to 2026-02-23 | Auth + Clients | RBAC completed, initial client module |
| Week 3 | 2026-02-24 to 2026-03-02 | Clients + Memberships | Client CRUD stable, membership assignment |
| Week 4 | 2026-03-03 to 2026-03-09 | Memberships + Payments | Payment workflow integrated |
| Week 5 | 2026-03-10 to 2026-03-16 | Receipts + Notifications | PDF receipts and reminder worker |
| Week 6 | 2026-03-17 to 2026-03-23 | Dashboard + Reports | Metrics and PDF exports |
| Week 7 | 2026-03-24 to 2026-03-30 | Audit + Backups + QA | Audit trail, automated backups, regression fixes |
| Week 8 | 2026-03-31 to 2026-04-09 | Stabilization + Go-live | UAT, deployment, launch checklist |

---

## Milestones

| Milestone | Date | Exit Criteria |
|---|---|---|
| M1 - Technical Base Ready | 2026-02-16 | API + DB + auth skeleton in Docker |
| M2 - Core Operations Ready | 2026-03-09 | Client, membership, payment core flows complete |
| M3 - Automation Ready | 2026-03-16 | Receipts and email reminders in staging |
| M4 - Reporting and Ops Ready | 2026-03-30 | Dashboard, PDF reports, audit, backups complete |
| M5 - MVP Go-Live | 2026-04-09 | UAT approved and production deployed |

---

## Cross-Team Dependency Map (Single Full-Stack Owner)

- Backend auth must be complete before frontend role guards.
- Client and membership APIs must be stable before final UI forms.
- Payment endpoint and receipt service are required before billing UI sign-off.
- Reminder worker depends on membership expiration and email credentials.
- Reports UI depends on dashboard/report endpoints.

---

## Risks and Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep from non-MVP requests | Delays launch | Enforce MVP exclusions list and change control |
| Email deliverability issues (Google) | Missed reminders | Configure SPF/DKIM early and test weekly |
| Data migration quality from paper | Incorrect records | Define import template + manual verification pass |
| Single developer bandwidth | Bottlenecks | Weekly priority review, strict P0-first execution |
| VPS setup/ops issues | Deployment delays | Provision infrastructure in Week 1 |

---

## Launch Readiness Checklist

- Production environment configured (Docker, SSL, DNS, backups).
- Admin, Staff, and Billing role permissions validated.
- End-to-end flows tested: login -> client -> membership -> payment -> receipt.
- Reminder email job tested with real schedule simulation.
- Daily backup and restore test executed successfully.
- Basic operations guide prepared for gym staff.
