package com.socialcommerce.platform.product.repository;

import com.socialcommerce.platform.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
}
