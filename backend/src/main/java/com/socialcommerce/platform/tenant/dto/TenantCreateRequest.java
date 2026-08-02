package com.socialcommerce.platform.tenant.dto;

import com.socialcommerce.platform.tenant.entity.SubscriptionPlan;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TenantCreateRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 100) String domain,
        SubscriptionPlan subscriptionPlan
) {}
