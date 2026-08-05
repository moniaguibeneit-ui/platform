package com.socialcommerce.platform.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * Image liÃÃÃÃÂ©e ÃÃÃÃÂ  un produit (SAD 5.7.3).
 * Un produit peut avoir plusieurs images.
 */
@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class ProductImage {

    @Id
    @GeneratedValue
    @Column(name = "image_id")
    private UUID id;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
