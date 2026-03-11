-- ============================================================
-- 001_init.sql  –  Chapitos Gym MVP Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name          TEXT        NOT NULL,
    email         TEXT        NOT NULL UNIQUE,
    password_hash TEXT        NOT NULL,
    role          TEXT        NOT NULL CHECK (role IN ('admin','staff','billing')),
    active        BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    first_name TEXT        NOT NULL,
    last_name  TEXT        NOT NULL,
    birth_date DATE        NOT NULL,
    phone      TEXT        NOT NULL,
    email      TEXT        NOT NULL,
    address    TEXT        NOT NULL DEFAULT '',
    active     BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Membership plans
CREATE TABLE IF NOT EXISTS membership_plans (
    id             TEXT    PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name           TEXT    NOT NULL,
    duration_days  INTEGER NOT NULL DEFAULT 30,
    price_standard NUMERIC(10,2) NOT NULL,
    price_student  NUMERIC(10,2) NOT NULL,
    active         BOOLEAN NOT NULL DEFAULT TRUE
);

-- Memberships
CREATE TABLE IF NOT EXISTS memberships (
    id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    client_id  TEXT        NOT NULL REFERENCES clients(id),
    plan_id    TEXT        NOT NULL REFERENCES membership_plans(id),
    price_type TEXT        NOT NULL CHECK (price_type IN ('standard','student')),
    price      NUMERIC(10,2) NOT NULL,
    start_date DATE        NOT NULL,
    end_date   DATE        NOT NULL,
    status     TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
    created_by TEXT        NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    client_id     TEXT          NOT NULL REFERENCES clients(id),
    membership_id TEXT          NOT NULL REFERENCES memberships(id),
    amount        NUMERIC(10,2) NOT NULL,
    method        TEXT          NOT NULL CHECK (method IN ('cash','card','bank_transfer')),
    reference     TEXT          NOT NULL DEFAULT '',
    paid_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    created_by    TEXT          NOT NULL REFERENCES users(id)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id     TEXT        NOT NULL REFERENCES users(id),
    action      TEXT        NOT NULL,
    entity      TEXT        NOT NULL,
    entity_id   TEXT        NOT NULL,
    before_json TEXT        NOT NULL DEFAULT '',
    after_json  TEXT        NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notification jobs
CREATE TABLE IF NOT EXISTS notification_jobs (
    id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    client_id     TEXT        NOT NULL REFERENCES clients(id),
    membership_id TEXT        NOT NULL REFERENCES memberships(id),
    channel       TEXT        NOT NULL DEFAULT 'email',
    send_at       TIMESTAMPTZ NOT NULL,
    status        TEXT        NOT NULL DEFAULT 'pending',
    attempts      INTEGER     NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memberships_client   ON memberships(client_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status   ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_end_date ON memberships(end_date);
CREATE INDEX IF NOT EXISTS idx_payments_client      ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at     ON payments(paid_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity    ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_clients_email        ON clients(email);

-- ── Seed data ────────────────────────────────────────────────────────────────

-- Default monthly plan
INSERT INTO membership_plans (id, name, duration_days, price_standard, price_student, active)
VALUES ('plan_monthly', 'Monthly', 30, 500.00, 350.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Default admin user  (password: Admin1234!)
INSERT INTO users (id, name, email, password_hash, role, active)
VALUES (
    'usr_admin',
    'System Admin',
    'admin@chapitosgym.com',
    '$2a$12$BNekwZvBCXqkGdqelVU/G.Upb.jU.Oh4258LVqKgHawjZquGS.aWa',
    'admin',
    TRUE
)
ON CONFLICT (id) DO NOTHING;
