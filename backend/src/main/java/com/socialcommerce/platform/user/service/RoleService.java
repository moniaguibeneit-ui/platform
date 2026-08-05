package com.socialcommerce.platform.user.service;

import com.socialcommerce.platform.tenant.context.TenantContext;
import com.socialcommerce.platform.user.dto.RoleRequest;
import com.socialcommerce.platform.user.entity.Role;
import com.socialcommerce.platform.user.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Role CRUD service (tenant-scoped, SAD ÃÂ§4.8).
 */
@Service
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role create(RoleRequest req) {
        UUID tenantId = TenantContext.requireTenantId();
        if (roleRepository.findByTenantIdAndName(tenantId, req.name()).isPresent()) {
            throw new IllegalArgumentException("Role " + req.name() + " already exists in this tenant");
        }
        Role role = Role.builder()
                .tenantId(tenantId)
                .name(req.name())
                .build();
        return roleRepository.save(role);
    }

    public void delete(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Role " + id + " not found"));
        roleRepository.delete(role);
    }
}
