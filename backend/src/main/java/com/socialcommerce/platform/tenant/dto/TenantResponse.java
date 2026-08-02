package com.socialcommerce.platform.tenant.dto;

import com.socialcommerce.platform.tenant.entity.SubscriptionPlan;
import com.socialcommerce.platform.tenant.entity.Tenant;
import com.socialcommerce.platform.tenant.entity.TenantStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TenantResponse(
        UUID id, String name, String domain,
        SubscriptionPlan subscriptionPlan, TenantStatus status, Boolean active,
        LocalDateTime createdAt, LocalDateTime updatedAt
) {
    public static TenantResponse from(Tenant t) {
        return new TenantResponse(t.getId(), t.getName(), t.getDomain(),
                t.getSubscriptionPlan(), t.getStatus(), t.getActive(),
                t.getCreatedAt(), t.getUpdatedAt());
    }
}
