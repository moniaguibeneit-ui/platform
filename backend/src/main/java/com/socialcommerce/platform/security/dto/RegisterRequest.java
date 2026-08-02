package com.socialcommerce.platform.security.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 150) String email,
        @NotBlank @Size(min = 6) String password,
        String firstName,
        String lastName,
        @NotBlank String tenantId
) {}
