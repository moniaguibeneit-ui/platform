-- V4 - Orders and order line items (tenant-scoped, SAD 2.5.3, 5.7.4)

CREATE TABLE orders (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID          NOT NULL,
    order_number  VARCHAR(50)   NOT NULL UNIQUE,
    user_id       UUID,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    total_amount  NUMERIC(12,2) NOT NULL,
    notes         VARCHAR(500),
    shipped_at    TIMESTAMP,
    delivered_at  TIMESTAMP,
    created_at    TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT now(),
    CONSTRAINT fk_orders_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE INDEX idx_orders_tenant ON orders (tenant_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_user ON orders (user_id);

CREATE TABLE order_line_items (
    item_id       UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID,
    product_name  VARCHAR(150),
    quantity      INTEGER       NOT NULL,
    unit_price    NUMERIC(10,2) NOT NULL,
    line_total    NUMERIC(12,2) NOT NULL
);

CREATE TABLE order_items (
    order_id  UUID NOT NULL,
    item_id   UUID NOT NULL,
    PRIMARY KEY (order_id, item_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_item FOREIGN KEY (item_id) REFERENCES order_line_items (item_id) ON DELETE CASCADE
);
