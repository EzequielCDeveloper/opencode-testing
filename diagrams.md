# Chapitos Gym - Development Diagrams

This file consolidates development diagrams based on the documentation set in `docs/` (`mvp-overview`, backend/frontend plans, API contract, architecture notes, roadmap, sprint board, and backlog).

## 1) Product Scope and Actors (MVP)

```mermaid
flowchart LR
    Admin[Admin] --> App[Gym Membership Web App]
    Staff[Staff] --> App
    Billing[Billing] --> App

    App --> Auth[Authentication and RBAC]
    App --> Clients[Client Management]
    App --> Memberships[Membership Management]
    App --> Payments[Payments and Receipts]
    App --> Reports[Dashboard and Reports]
    App --> Notifications[Email Reminders]
    App --> Ops[Audit Logs and Backups]

    Excluded["Excluded from MVP<br/>Freeze, grace period,<br/>partial payments, refunds,<br/>client portal, multi-location"]
    App -. future .-> Excluded
```

## 2) High-Level Architecture

```mermaid
flowchart TB
    User[Gym Staff User]

    subgraph Frontend[Next.js Frontend]
        UI[SSR Pages and UI]
        Guards[Role Guards]
        APIClient[Typed API Client]
    end

    subgraph Backend[Go Backend - Hexagonal]
        InPorts[HTTP Handlers and DTOs]
        UseCases[Application Use Cases]
        Domain[Domain Entities and Rules]
        OutPorts[Repository and Service Ports]
    end

    subgraph Infra[Infrastructure]
        PG[(PostgreSQL)]
        Mail[Google Email Provider]
        PDF[PDF Generator]
        Cron[Cron or Worker Scheduler]
        Audit[(Audit Logs)]
        Backup[(Backup Storage)]
    end

    User --> UI
    UI --> Guards
    UI --> APIClient
    APIClient --> InPorts
    InPorts --> UseCases
    UseCases --> Domain
    UseCases --> OutPorts
    OutPorts --> PG
    OutPorts --> Mail
    OutPorts --> PDF
    Cron --> UseCases
    OutPorts --> Audit
    OutPorts --> Backup
```

## 3) Core Data Model (MVP)

```mermaid
erDiagram
    USERS {
        string id PK
        string name
        string email
        string password_hash
        string role
        boolean active
        datetime created_at
    }

    CLIENTS {
        string id PK
        string first_name
        string last_name
        date birth_date
        string phone
        string email
        string address
        boolean active
        datetime created_at
        datetime updated_at
    }

    MEMBERSHIP_PLANS {
        string id PK
        string name
        int duration_days
        decimal price_standard
        decimal price_student
        boolean active
    }

    MEMBERSHIPS {
        string id PK
        string client_id FK
        string plan_id FK
        string price_type
        date start_date
        date end_date
        string status
        string created_by FK
        datetime created_at
    }

    PAYMENTS {
        string id PK
        string client_id FK
        string membership_id FK
        decimal amount
        string payment_method
        datetime paid_at
        string reference
        string created_by FK
    }

    RECEIPTS {
        string id PK
        string payment_id FK
        string receipt_number
        string pdf_path
        datetime issued_at
    }

    NOTIFICATION_JOBS {
        string id PK
        string client_id FK
        string membership_id FK
        string channel
        datetime send_at
        string status
        int attempts
    }

    AUDIT_LOGS {
        string id PK
        string user_id FK
        string action
        string entity
        string entity_id
        string before_json
        string after_json
        datetime created_at
    }

    CLIENTS ||--o{ MEMBERSHIPS : has
    MEMBERSHIP_PLANS ||--o{ MEMBERSHIPS : defines
    USERS ||--o{ MEMBERSHIPS : creates

    CLIENTS ||--o{ PAYMENTS : makes
    MEMBERSHIPS ||--o{ PAYMENTS : billed_by
    USERS ||--o{ PAYMENTS : recorded_by

    PAYMENTS ||--|| RECEIPTS : generates

    CLIENTS ||--o{ NOTIFICATION_JOBS : receives
    MEMBERSHIPS ||--o{ NOTIFICATION_JOBS : schedules

    USERS ||--o{ AUDIT_LOGS : performs
```

## 4) RBAC Access Model (API v1)

```mermaid
flowchart LR
    subgraph Roles
        A[admin]
        S[staff]
        B[billing]
    end

    subgraph Resources
        Auth[Auth]
        Cli[Clients]
        Mem[Memberships]
        Pay[Payments and Receipts]
        Dash[Dashboard]
        Rep[Reports]
        Ops[Audit Logs and Backup]
        Rem[Manual Reminder Trigger]
    end

    A --> Auth
    A --> Cli
    A --> Mem
    A --> Pay
    A --> Dash
    A --> Rep
    A --> Ops
    A --> Rem

    S --> Auth
    S --> Cli
    S --> Mem
    S --> Pay
    S --> Dash
    S --> Rep

    B --> Auth
    B --> Cli
    B --> Mem
    B --> Pay
    B --> Rep
```

## 5) Main Operational Flow (Client to Receipt)

```mermaid
sequenceDiagram
    autonumber
    participant U as Staff User
    participant FE as Next.js Frontend
    participant API as Go API
    participant DB as PostgreSQL
    participant PDF as Receipt Service
    participant AU as Audit Log

    U->>FE: Login
    FE->>API: POST /auth/login
    API->>DB: Validate user and role
    DB-->>API: User record
    API-->>FE: JWT or session

    U->>FE: Register or update client
    FE->>API: POST or PUT /clients
    API->>DB: Persist client
    API->>AU: Record mutation
    API-->>FE: Client saved

    U->>FE: Assign monthly membership
    FE->>API: POST /memberships
    API->>DB: Create membership
    API->>AU: Record mutation
    API-->>FE: Membership active

    U->>FE: Record full payment
    FE->>API: POST /payments
    API->>DB: Store payment
    API->>PDF: Generate receipt PDF
    PDF-->>API: Receipt path or id
    API->>DB: Store receipt metadata
    API->>AU: Record payment and receipt
    API-->>FE: Payment and receipt ready
```

## 6) Automated Expiration Reminder Flow

```mermaid
sequenceDiagram
    autonumber
    participant S as Scheduler
    participant W as Reminder Worker
    participant DB as PostgreSQL
    participant M as Google Mail
    participant A as Audit Logs

    S->>W: Trigger periodic run
    W->>DB: Query memberships expiring in 3 days
    DB-->>W: Candidate memberships

    loop each candidate
        W->>DB: Create or update notification_job
        W->>M: Send reminder email
        alt success
            M-->>W: Accepted
            W->>DB: Mark job as sent
        else failure
            M-->>W: Error
            W->>DB: Increment attempts and mark failed
        end
        W->>A: Write operational audit event
    end
```

## 7) Deployment Topology (MVP)

```mermaid
flowchart TB
    Staff[Gym Internal Users]
    CF[Cloudflare DNS and SSL]
    VPS[Ubuntu VPS]

    subgraph DockerHost[Docker Runtime on VPS]
        FE[Next.js Container]
        BE[Go API Container]
        DB[(PostgreSQL Container or Managed DB)]
        WK[Worker or Cron Container]
    end

    BackupStore[(Daily Backup Destination)]

    Staff --> CF
    CF --> FE
    FE --> BE
    BE --> DB
    WK --> DB
    WK --> BE
    DB --> BackupStore
```

## 8) Delivery Timeline (8 Weeks)

```mermaid
gantt
    title Chapitos MVP Roadmap (2026-02-10 to 2026-04-09)
    dateFormat  YYYY-MM-DD
    axisFormat  %m-%d

    section Foundations
    Setup, schema, auth base          :w1, 2026-02-10, 7d

    section Core Modules
    Auth plus clients                 :w2, 2026-02-17, 7d
    Clients plus memberships          :w3, 2026-02-24, 7d
    Memberships plus payments         :w4, 2026-03-03, 7d

    section Automation and Reporting
    Receipts plus notifications       :w5, 2026-03-10, 7d
    Dashboard plus reports            :w6, 2026-03-17, 7d

    section Hardening and Launch
    Audit backups and QA              :w7, 2026-03-24, 7d
    Stabilization and go-live         :w8, 2026-03-31, 10d
```

## 9) Sprint Board Flow

```mermaid
flowchart LR
    Backlog --> ThisSprint[This Sprint]
    ThisSprint --> InProgress[In Progress]
    InProgress --> Review[Review and QA]
    InProgress --> Blocked
    Blocked --> InProgress
    Review --> Done
    Review --> InProgress
```
