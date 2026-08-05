package com.socialcommerce.platform.product.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank
    private String name;
    private String brand;
    private String description;
    @Positive
    private BigDecimal price;
    private String category;
    private String volume;
    private String fragranceNotes;
    private Boolean inStock;
    private String imageUrl; // primary image
    private List<String> imageUrls; // additional images
}
