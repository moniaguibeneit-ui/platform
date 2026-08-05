package com.socialcommerce.platform.order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Line item in an order (SAD ÃÃÃÂ§2.5.3).
 * References a product with a snapshot of the price at order time.
 */
@Entity
@Table(name = "order_line_items")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class OrderItem {

    @Id
    @GeneratedValue
    @Column(name = "item_id")
    private UUID id;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "product_name", length = 150)
    private String productName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "line_total", nullable = false)
    private BigDecimal lineTotal;
}
