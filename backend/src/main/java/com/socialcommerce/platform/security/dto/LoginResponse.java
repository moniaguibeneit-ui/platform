package com.socialcommerce.platform.security.dto;

import java.util.List;

public record LoginResponse(
        String token,
        String tokenType,
        String userId,
        String email,
        String tenantId,
        List<String> roles
) {}
