package com.socialcommerce.platform.user.service;

import com.socialcommerce.platform.tenant.context.TenantContext;
import com.socialcommerce.platform.user.dto.UserRequest;
import com.socialcommerce.platform.user.dto.UserResponse;
import com.socialcommerce.platform.user.entity.Role;
import com.socialcommerce.platform.user.entity.User;
import com.socialcommerce.platform.user.repository.RoleRepository;
import com.socialcommerce.platform.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * User CRUD service (tenant-scoped, SAD ÃÂ§4.8, ÃÂ§6.7).
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        return userRepository.findById(id)
                .map(UserResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("User " + id + " not found"));
    }

    public UserResponse create(UserRequest req) {
        UUID tenantId = TenantContext.requireTenantId();
        if (userRepository.findByTenantIdAndEmail(tenantId, req.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered in this tenant");
        }
        User user = User.builder()
                .tenantId(tenantId)
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .active(req.getActive() != null ? req.getActive() : true)
                .build();
        if (req.getRoleIds() != null) {
            user.setRoles(resolveRoles(req.getRoleIds(), tenantId));
        }
        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse update(UUID id, UserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User " + id + " not found"));
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }
        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName() != null) user.setLastName(req.getLastName());
        if (req.getActive() != null) user.setActive(req.getActive());
        if (req.getRoleIds() != null) {
            user.setRoles(resolveRoles(req.getRoleIds(), user.getTenantId()));
        }
        return UserResponse.from(userRepository.save(user));
    }

    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User " + id + " not found");
        }
        userRepository.deleteById(id);
    }

    private Set<Role> resolveRoles(List<UUID> roleIds, UUID tenantId) {
        Set<Role> roles = new HashSet<>();
        for (UUID roleId : roleIds) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new EntityNotFoundException("Role " + roleId + " not found"));
            if (!role.getTenantId().equals(tenantId)) {
                throw new IllegalArgumentException("Role " + roleId + " does not belong to this tenant");
            }
            roles.add(role);
        }
        return roles;
    }
}
