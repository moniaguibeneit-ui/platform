-- ============================================================
-- V1 - Multi-Tenant foundation
-- Model: Shared Database + Shared Schema with tenant_id discriminator
-- (SAD §4.4)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- Tenant ----------
CREATE TABLE tenants (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100)  NOT NULL,
    domain          VARCHAR(100)  NOT NULL UNIQUE,
    subscription_plan VARCHAR(20) NOT NULL DEFAULT 'STARTER',
    status          VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_tenants_status ON tenants (status);
CREATE INDEX idx_tenants_active ON tenants (active);

-- ---------- Roles (tenant-scoped RBAC, SAD §4.8) ----------
CREATE TABLE roles (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID        NOT NULL,
    name        VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT now(),
    CONSTRAINT fk_roles_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT uk_roles_tenant_name UNIQUE (tenant_id, name)
);

CREATE INDEX idx_roles_tenant ON roles (tenant_id);

-- ---------- Users (tenant-scoped, SAD §5.7.2) ----------
CREATE TABLE users (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID          NOT NULL,
    email           VARCHAR(150)  NOT NULL,
    password_hash   VARCHAR(255)  NOT NULL,
    first_name      VARCHAR(80),
    last_name       VARCHAR(80),
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now(),
    CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
    CONSTRAINT uk_users_tenant_email UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users (tenant_id);
CREATE INDEX idx_users_email  ON users (email);

-- ---------- User <-> Role association ----------
CREATE TABLE user_roles (
    user_id     UUID NOT NULL,
    role_id     UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE INDEX idx_user_roles_role ON user_roles (role_id);

-- ---------- Tenant subscriptions (SAD §4.7) ----------
CREATE TABLE tenant_subscriptions (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID          NOT NULL,
    plan            VARCHAR(20)   NOT NULL,
    status          VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    started_at      TIMESTAMP     NOT NULL DEFAULT now(),
    ends_at         TIMESTAMP,
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now(),
    CONSTRAINT fk_subscriptions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX uk_subscriptions_tenant_active
    ON tenant_subscriptions (tenant_id) WHERE status = 'ACTIVE';

CREATE INDEX idx_subscriptions_tenant ON tenant_subscriptions (tenant_id);
CREATE INDEX idx_subscriptions_status ON tenant_subscriptions (status);
