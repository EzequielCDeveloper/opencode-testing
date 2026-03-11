# Product Backlog - Chapitos Gym Membership System

## Legend
- **P0**: Critical (MVP must-have)
- **P1**: High (Essential)
- **P2**: Medium (Important)
- **P3**: Low (Nice to have)

---

## 1. Authentication & Authorization

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| AUTH-001 | P0 | User Login | Admin and staff login system |
| AUTH-002 | P0 | JWT Authentication | Token-based auth with expiration |
| AUTH-003 | P0 | Role-Based Access Control | Define Admin, Staff, Trainer roles |
| AUTH-004 | P1 | Session Management | Configurable session timeout |
| AUTH-005 | P2 | Password Recovery | Email-based password reset |
| AUTH-006 | P2 | Two-Factor Auth | Optional 2FA for admin |
| AUTH-007 | P3 | Audit Logging | Track user login/logout events |

---

## 2. Client Management

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| CLIENT-001 | P0 | Client Registration | Register new clients with personal data |
| CLIENT-002 | P0 | Client List | View all clients with pagination and search |
| CLIENT-003 | P0 | Client Details | Full client profile view |
| CLIENT-004 | P0 | Client Edit | Update client information |
| CLIENT-005 | P1 | Client Search | Advanced search by name, email, phone |
| CLIENT-006 | P1 | Client Status | Active/Inactive/Expired filter |
| CLIENT-007 | P1 | Client Delete/Deactivate | Soft delete functionality |
| CLIENT-008 | P2 | Client Import/Export | Bulk import from CSV, export to Excel/PDF |
| CLIENT-009 | P2 | Client Notes | Add internal notes to client records |
| CLIENT-010 | P3 | Client Photo | Profile photo upload |

---

## 3. Membership Management

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| MEMB-001 | P0 | Membership Types | Create membership types (monthly, annual, etc.) |
| MEMB-002 | P0 | Membership Pricing | Set and manage prices per membership type |
| MEMB-003 | P0 | Assign Membership | Link membership to client |
| MEMB-004 | P0 | Membership Status | Track Active, Expired, Frozen, Cancelled |
| MEMB-005 | P1 | Membership History | View membership change history |
| MEMB-006 | P1 | Membership Upgrade/Downgrade | Change membership type mid-cycle |
| MEMB-007 | P1 | Membership Freeze | Pause membership for X days |
| MEMB-008 | P2 | Grace Period | Configurable grace period after expiration |
| MEMB-009 | P2 | Auto-Renewal | Optional auto-renewal for memberships |
| MEMB-010 | P3 | Membership Templates | Predefined templates with benefits |

---

## 4. Payments & Billing

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| PAY-001 | P0 | Record Payment | Manual payment entry (cash, card, transfer) |
| PAY-002 | P0 | Payment History | View all payments per client |
| PAY-003 | P0 | Payment Status | Paid, Pending, Overdue, Refunded |
| PAY-004 | P0 | Outstanding Balance | View clients with pending payments |
| PAY-005 | P1 | Payment Receipts | Generate and download receipts |
| PAY-006 | P1 | Payment Methods | Track cash, card, bank transfer, etc. |
| PAY-007 | P2 | Partial Payments | Allow split payments |
| PAY-008 | P2 | Refunds | Process refunds with approval workflow |
| PAY-009 | P3 | Online Payments | Integrate payment gateway (Stripe, PayPal) |
| PAY-010 | P3 | Invoice Generation | Generate formal invoices |

---

## 5. Notifications & Reminders

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| NOTIF-001 | P0 | Expiration Reminders | Automated reminders before expiration |
| NOTIF-002 | P1 | Expiration Schedule | Configurable reminder days (7, 3, 1 day before) |
| NOTIF-003 | P1 | Payment Reminders | Remind about overdue payments |
| NOTIF-004 | P2 | Notification Channels | Email, SMS, WhatsApp support |
| NOTIF-005 | P2 | Notification Templates | Customizable message templates |
| NOTIF-006 | P2 | Notification Log | View sent notifications history |
| NOTIF-007 | P3 | Push Notifications | Browser/app push notifications |
| NOTIF-008 | P3 | Automated Birthday Wishes | Birthday celebration messages |

---

## 6. Dashboard & Reporting

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| DASH-001 | P0 | Dashboard Overview | Key metrics (active members, revenue, expiring) |
| DASH-002 | P1 | Revenue Reports | Daily/weekly/monthly revenue charts |
| DASH-003 | P1 | Membership Reports | Membership type distribution |
| DASH-004 | P1 | Expiration Reports | Upcoming expirations list |
| DASH-005 | P1 | Payment Reports | Outstanding payments summary |
| DASH-006 | P2 | Custom Reports | Generate custom date range reports |
| DASH-007 | P2 | Export Reports | Export to PDF, Excel, CSV |
| DASH-008 | P3 | Analytics | Member growth, churn rate, LTV |
| DASH-009 | P3 | Scheduled Reports | Auto-send reports via email |

---

## 7. Admin & System

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| ADMIN-001 | P0 | System Settings | Core configuration (company info, currency, etc.) |
| ADMIN-002 | P0 | User Management | Create/manage system users |
| ADMIN-003 | P0 | Role Management | Define permissions per role |
| ADMIN-004 | P1 | Data Backup | Automated daily backups |
| ADMIN-005 | P1 | Activity Log | Track all system changes |
| ADMIN-006 | P2 | Multi-Location | Support multiple gym locations |
| ADMIN-007 | P2 | API Access | REST API for third-party integrations |
| ADMIN-008 | P3 | System Health | Server health and performance monitoring |
| ADMIN-009 | P3 | Multi-Language | Support multiple languages |

---

## 8. Frontend Features

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| FE-001 | P0 | Responsive Design | Mobile-friendly interface |
| FE-002 | P0 | Login Page | Clean, secure login interface |
| FE-003 | P0 | Dashboard UI | Intuitive dashboard with charts |
| FE-004 | P0 | Client CRUD UI | Forms and tables for client management |
| FE-005 | P0 | Membership UI | Membership management interface |
| FE-006 | P0 | Payment UI | Payment recording interface |
| FE-007 | P1 | Search Functionality | Global search across modules |
| FE-008 | P1 | Data Tables | Sortable, filterable tables with pagination |
| FE-009 | P1 | Form Validation | Client-side validation for all forms |
| FE-010 | P2 | Dark Mode | Optional dark theme |
| FE-011 | P2 | Client Portal | Self-service portal for members |
| FE-012 | P3 | Mobile App | React Native/Expo mobile app |

---

## 9. Backend Infrastructure

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| BE-001 | P0 | REST API | Complete RESTful API |
| BE-002 | P0 | Database Schema | PostgreSQL with proper relationships |
| BE-003 | P0 | Error Handling | Consistent error responses |
| BE-004 | P1 | API Documentation | Swagger/OpenAPI docs |
| BE-005 | P1 | Input Validation | Server-side validation |
| BE-006 | P1 | Rate Limiting | Prevent API abuse |
| BE-007 | P2 | CORS Configuration | Proper cross-origin setup |
| BE-008 | P2 | Logging | Structured application logging |
| BE-009 | P3 | GraphQL API | Optional GraphQL endpoint |
| BE-010 | P3 | Webhooks | Event-driven integrations |

---

## 10. DevOps & Deployment

| ID | Priority | Feature | Description |
|----|----------|---------|-------------|
| DEV-001 | P0 | Docker Setup | Containerized backend and frontend |
| DEV-002 | P0 | Database Setup | PostgreSQL in Docker |
| DEV-003 | P0 | CI/CD Pipeline | Automated testing and deployment |
| DEV-004 | P1 | Environment Variables | Secure config management |
| DEV-005 | P1 | SSL/HTTPS | Cloudflare SSL setup |
| DEV-006 | P1 | Domain & DNS | Cloudflare DNS configuration |
| DEV-007 | P2 | Monitoring | Server monitoring (CPU, memory, disk) |
| DEV-008 | P2 | Error Tracking | Sentry or similar error tracking |
| DEV-009 | P3 | Staging Environment | Separate staging for testing |
| DEV-010 | P3 | Load Balancing | Horizontal scaling setup |

---

## Phasing Strategy

### Phase 1 - MVP (P0 items only)
- Authentication & basic RBAC
- Client management (CRUD)
- Membership types & assignment
- Basic payment recording
- Simple dashboard
- Docker deployment

### Phase 2 - Essential (P1 items)
- Advanced search & filters
- Payment history & receipts
- Expiration reminders
- Enhanced reporting
- User management
- Backup & activity logging

### Phase 3 - Polish (P2 items)
- Online payments
- Multi-location support
- API access
- Client self-service portal
- Advanced notifications
- Custom reports

### Phase 4 - Growth (P3 items)
- Mobile app
- GraphQL API
- Full analytics
- Multi-language
- Marketing integrations
