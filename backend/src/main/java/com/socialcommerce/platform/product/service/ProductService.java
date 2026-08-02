package com.socialcommerce.platform.product.service;

import com.socialcommerce.platform.product.dto.ProductRequest;
import com.socialcommerce.platform.product.dto.ProductResponse;
import com.socialcommerce.platform.product.entity.Product;
import com.socialcommerce.platform.product.repository.ProductRepository;
import com.socialcommerce.platform.tenant.context.TenantContext;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Product CRUD service (SAD ÃÂ§5.7.3).
 *
 * All operations are automatically scoped to the current tenant via
 * TenantContext + Hibernate @Filter("tenant").
 */
@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(UUID id) {
        return productRepository.findById(id)
                .map(ProductResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Product " + id + " not found"));
    }

    public ProductResponse create(ProductRequest req) {
        Product product = Product.builder()
                .tenantId(TenantContext.requireTenantId())
                .name(req.getName())
                .brand(req.getBrand())
                .description(req.getDescription())
                .price(req.getPrice())
                .category(req.getCategory())
                .volume(req.getVolume())
                .fragranceNotes(req.getFragranceNotes())
                .inStock(req.getInStock() != null ? req.getInStock() : true)
                .imageUrl(req.getImageUrl())
                .build();
        return ProductResponse.from(productRepository.save(product));
    }

    public ProductResponse update(UUID id, ProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product " + id + " not found"));
        if (req.getName() != null) product.setName(req.getName());
        if (req.getBrand() != null) product.setBrand(req.getBrand());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getPrice() != null) product.setPrice(req.getPrice());
        if (req.getCategory() != null) product.setCategory(req.getCategory());
        if (req.getVolume() != null) product.setVolume(req.getVolume());
        if (req.getFragranceNotes() != null) product.setFragranceNotes(req.getFragranceNotes());
        if (req.getInStock() != null) product.setInStock(req.getInStock());
        if (req.getImageUrl() != null) product.setImageUrl(req.getImageUrl());
        return ProductResponse.from(productRepository.save(product));
    }

    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product " + id + " not found");
        }
        productRepository.deleteById(id);
    }
}
