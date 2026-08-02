package com.socialcommerce.platform.tenant.dto;

import jakarta.validation.constraints.Size;

public record TenantUpdateRequest(
        @Size(max = 100) String name,
        @Size(max = 100) String domain
) {}
