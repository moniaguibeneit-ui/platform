-- V3 - Products table (tenant-scoped, SAD Â§5.7.3)
CREATE TABLE products (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID          NOT NULL,
    name            VARCHAR(150)  NOT NULL,
    brand           VARCHAR(100),
    description     VARCHAR(500),
    price           NUMERIC(10,2) NOT NULL,
    category        VARCHAR(100),
    volume          VARCHAR(50),
    fragrance_notes VARCHAR(255),
    in_stock        BOOLEAN       NOT NULL DEFAULT TRUE,
    image_url       VARCHAR(500),
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now(),
    CONSTRAINT fk_products_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE INDEX idx_products_tenant ON products (tenant_id);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_name ON products (name);
