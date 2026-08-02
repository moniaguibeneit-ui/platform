package com.socialcommerce.platform.user.repository;

import com.socialcommerce.platform.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByTenantIdAndName(UUID tenantId, String name);
}
