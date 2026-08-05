package com.socialcommerce.platform.security;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.socialcommerce.platform.security.dto.LoginRequest;
import com.socialcommerce.platform.security.dto.LoginResponse;
import com.socialcommerce.platform.security.dto.RegisterRequest;
import com.socialcommerce.platform.user.entity.Role;
import com.socialcommerce.platform.user.entity.User;
import com.socialcommerce.platform.user.repository.RoleRepository;
import com.socialcommerce.platform.user.repository.UserRepository;

/**
 * Authentification et enregistrement (SAD 6.4, 6.7).
 *
 * On register, the user is assigned the ADMIN role of the tenant
 * (first user becomes the tenant admin, SAD 4.8).
 */
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        UUID tenantId = UUID.fromString(request.tenantId());
        User user = userRepository.findByTenantIdAndEmail(tenantId, request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new IllegalStateException("User account is disabled");
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        List<String> roles = user.getRoles() == null ? List.of()
                : user.getRoles().stream().map(Role::getName).toList();
        String token = jwtService.generateToken(user, tenantId, roles);
        return new LoginResponse(
                token, "Bearer",
                user.getId().toString(),
                user.getEmail(),
                tenantId.toString(),
                roles
        );
    }

    public LoginResponse register(RegisterRequest request) {
        UUID tenantId = UUID.fromString(request.tenantId());
        if (userRepository.findByTenantIdAndEmail(tenantId, request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already registered in this tenant");
        }

        // Assign ADMIN role from the tenant's default roles
        Set<Role> roles = new HashSet<>();
        roleRepository.findByTenantIdAndName(tenantId, "ADMIN")
                .ifPresent(roles::add);

        User user = User.builder()
                .tenantId(tenantId)
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .active(true)
                .build();
        user.setRoles(roles);
        user = userRepository.save(user);

        List<String> roleNames = roles.stream().map(Role::getName).toList();
        String token = jwtService.generateToken(user, tenantId, roleNames);
        return new LoginResponse(
                token, "Bearer",
                user.getId().toString(),
                user.getEmail(),
                tenantId.toString(),
                roleNames
        );
    }
}
