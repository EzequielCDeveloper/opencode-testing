# API Contract v1.0

Base URL: `/api/v1`

## 1. Standards

- Content type: `application/json`
- Auth: `Authorization: Bearer <token>`
- Time format: ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
- Currency values: decimal number, 2 precision
- Pagination: `page` (default `1`), `limit` (default `20`, max `100`)

---

## 2. Roles and Access

- `admin`: full access
- `staff`: clients, memberships, dashboard, reports
- `billing`: payments, receipts, payment reports, client read access

---

## 3. Common Response Envelope

## Success

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-02-10T10:00:00Z"
  }
}
```

## Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  },
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-02-10T10:00:00Z"
  }
}
```

---

## 4. Authentication

## `POST /auth/login`

Request:

```json
{
  "email": "admin@chapitosgym.com",
  "password": "StrongPassword123"
}
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "expiresIn": 57600,
    "user": {
      "id": "usr_1",
      "name": "System Admin",
      "email": "admin@chapitosgym.com",
      "role": "admin"
    }
  }
}
```

## `POST /auth/logout`
- Invalidates active session/token.
- Response `204`.

## `GET /auth/me`
- Returns current user profile.
- Roles: `admin`, `staff`, `billing`.

---

## 5. Clients

## Client object

```json
{
  "id": "cli_1",
  "firstName": "Juan",
  "lastName": "Perez",
  "birthDate": "1998-03-10",
  "phone": "+5215512345678",
  "email": "juan@example.com",
  "address": "Street 123",
  "active": true,
  "createdAt": "2026-02-12T10:00:00Z",
  "updatedAt": "2026-02-12T10:00:00Z"
}
```

## Endpoints

- `POST /clients` - create client
- `GET /clients?page=1&limit=20&search=juan&status=active` - list clients
- `GET /clients/{clientId}` - client detail
- `PUT /clients/{clientId}` - update client
- `PATCH /clients/{clientId}/deactivate` - soft deactivate client

Roles:
- create/update/deactivate: `admin`, `staff`
- read/list: `admin`, `staff`, `billing`

---

## 6. Memberships

## Membership object

```json
{
  "id": "mem_1",
  "clientId": "cli_1",
  "planId": "plan_monthly",
  "planName": "Monthly",
  "priceType": "student",
  "price": 25.0,
  "startDate": "2026-03-01",
  "endDate": "2026-03-31",
  "status": "active",
  "createdBy": "usr_1",
  "createdAt": "2026-03-01T08:00:00Z"
}
```

Rules:
- MVP supports monthly plan only.
- `priceType`: `standard` or `student`.
- No freeze, no grace period in v1.0.

Endpoints:
- `POST /memberships` - assign membership
- `GET /memberships?page=1&limit=20&status=active&clientId=cli_1` - list memberships
- `GET /memberships/{membershipId}` - membership detail
- `PATCH /memberships/{membershipId}/status` - update status (`active|expired|cancelled`)

Roles:
- create/update: `admin`, `staff`
- read/list: `admin`, `staff`, `billing`

---

## 7. Payments and Receipts

## Payment object

```json
{
  "id": "pay_1",
  "clientId": "cli_1",
  "membershipId": "mem_1",
  "amount": 25.0,
  "method": "card",
  "reference": "TXN-10001",
  "paidAt": "2026-03-01T09:00:00Z",
  "createdBy": "usr_2"
}
```

Rules:
- `method`: `cash`, `card`, `bank_transfer`.
- Full payment only (no partial payments).
- Refunds are not supported in v1.0.

Endpoints:
- `POST /payments` - record payment
- `GET /payments?page=1&limit=20&clientId=cli_1&from=2026-03-01&to=2026-03-31` - list payments
- `GET /payments/{paymentId}` - payment detail
- `GET /payments/{paymentId}/receipt` - download receipt PDF

Roles:
- create: `admin`, `billing`
- read/list/receipt: `admin`, `staff`, `billing`

---

## 8. Dashboard and Reports

## `GET /dashboard/metrics`

Response includes:
- active memberships count
- memberships expiring in next 7 days
- revenue summary (today, month)

Roles: `admin`, `staff`

## Reports

- `GET /reports/expirations?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /reports/revenue?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /reports/export/pdf?type=expirations|revenue&from=YYYY-MM-DD&to=YYYY-MM-DD`

Roles:
- `admin`, `staff`, `billing`

---

## 9. Notifications and Ops

## `POST /admin/notifications/reminders/run`
- Triggers reminder dispatch job manually.
- Role: `admin`

## `GET /audit-logs?page=1&limit=20&entity=client&entityId=cli_1`
- Returns tracked system mutations.
- Role: `admin`

## `POST /admin/backup/run`
- Triggers immediate backup.
- Role: `admin`

---

## 10. HTTP Status Codes

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `422` Validation Error
- `500` Internal Server Error
