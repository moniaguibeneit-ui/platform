package com.socialcommerce.platform.security;

import com.socialcommerce.platform.security.dto.LoginRequest;
import com.socialcommerce.platform.security.dto.LoginResponse;
import com.socialcommerce.platform.security.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints d'authentification (SAD §6.4).
 *
 * POST /api/auth/login    - login avec (email, password, tenantId)
 * POST /api/auth/register - création d'un user dans un tenant
 *
 * Ces routes sont publiques (pas de JWT requis).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }
}
