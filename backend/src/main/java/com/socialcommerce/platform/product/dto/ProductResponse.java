package com.socialcommerce.platform.product.dto;

import com.socialcommerce.platform.product.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String brand,
        String description,
        BigDecimal price,
        String category,
        String volume,
        String fragranceNotes,
        Boolean inStock,
        String imageUrl,
        UUID tenantId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getBrand(), p.getDescription(),
                p.getPrice(), p.getCategory(), p.getVolume(), p.getFragranceNotes(),
                p.getInStock(), p.getImageUrl(), p.getTenantId(),
                p.getCreatedAt(), p.getUpdatedAt()
        );
    }
}
