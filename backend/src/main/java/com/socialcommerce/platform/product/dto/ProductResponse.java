package com.socialcommerce.platform.product.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.socialcommerce.platform.product.entity.Product;
import com.socialcommerce.platform.product.entity.ProductImage;

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
        List<String> images,
        UUID tenantId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProductResponse from(Product p) {
        List<String> imageUrls = p.getImages() == null ? List.of()
                : p.getImages().stream().map(ProductImage::getImageUrl).toList();
        // Primary image: imageUrl field if set, otherwise first from images list
        String primary = p.getImageUrl();
        if (primary == null && !imageUrls.isEmpty()) {
            primary = imageUrls.get(0);
        }
        return new ProductResponse(
                p.getId(), p.getName(), p.getBrand(), p.getDescription(),
                p.getPrice(), p.getCategory(), p.getVolume(), p.getFragranceNotes(),
                p.getInStock(), primary, imageUrls, p.getTenantId(),
                p.getCreatedAt(), p.getUpdatedAt()
        );
    }
}
