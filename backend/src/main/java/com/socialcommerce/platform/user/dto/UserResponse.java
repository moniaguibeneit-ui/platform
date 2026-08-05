package com.socialcommerce.platform.user.dto;

import com.socialcommerce.platform.user.entity.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Boolean active,
        List<RoleSummary> roles,
        UUID tenantId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record RoleSummary(UUID id, String name) {}

    public static UserResponse from(User u) {
        return new UserResponse(
                u.getId(),
                u.getEmail(),
                u.getFirstName(),
                u.getLastName(),
                u.getActive(),
                u.getRoles() == null ? List.of()
                        : u.getRoles().stream().map(r -> new RoleSummary(r.getId(), r.getName())).toList(),
                u.getTenantId(),
                u.getCreatedAt(),
                u.getUpdatedAt()
        );
    }
}
