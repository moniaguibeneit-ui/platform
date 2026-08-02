package com.socialcommerce.platform.security;

import com.socialcommerce.platform.security.dto.LoginRequest;
import com.socialcommerce.platform.security.dto.LoginResponse;
import com.socialcommerce.platform.security.dto.RegisterRequest;
import com.socialcommerce.platform.user.entity.Role;
import com.socialcommerce.platform.user.entity.User;
import com.socialcommerce.platform.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Authentification et enregistrement des utilisateurs (SAD §6.4, §6.7).
 *
 * Le login est résolu par (tenantId, email) : un email peut exister
 * dans plusieurs tenants. Le password est vérifié avec BCrypt.
 */
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
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
        User user = User.builder()
                .tenantId(tenantId)
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .active(true)
                .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(user, tenantId, List.of());
        return new LoginResponse(
                token, "Bearer",
                user.getId().toString(),
                user.getEmail(),
                tenantId.toString(),
                List.of()
        );
    }
}
