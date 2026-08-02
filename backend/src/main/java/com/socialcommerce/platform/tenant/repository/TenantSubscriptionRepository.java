package com.socialcommerce.platform.tenant.repository;

import com.socialcommerce.platform.tenant.entity.SubscriptionStatus;
import com.socialcommerce.platform.tenant.entity.TenantSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TenantSubscriptionRepository extends JpaRepository<TenantSubscription, UUID> {
    Optional<TenantSubscription> findByTenantIdAndStatus(UUID tenantId, SubscriptionStatus status);
}
