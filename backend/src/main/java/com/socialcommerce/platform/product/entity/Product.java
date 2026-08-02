package com.socialcommerce.platform.product.entity;

import com.socialcommerce.platform.common.entity.TenantAwareEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

/**
 * Product entity, tenant-scoped (SAD Â§5.7.3).
 * Extends TenantAwareEntity for automatic tenant isolation via Hibernate filter.
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Product extends TenantAwareEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 100)
    private String brand;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(length = 100)
    private String category;

    @Column(length = 50)
    private String volume;

    @Column(name = "fragrance_notes", length = 255)
    private String fragranceNotes;

    @Column(name = "in_stock", nullable = false)
    private Boolean inStock;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}
