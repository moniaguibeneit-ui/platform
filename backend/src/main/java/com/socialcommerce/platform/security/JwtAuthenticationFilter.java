package com.socialcommerce.platform.security;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.socialcommerce.platform.tenant.context.TenantContext;
import com.socialcommerce.platform.tenant.entity.Tenant;
import com.socialcommerce.platform.tenant.entity.TenantStatus;
import com.socialcommerce.platform.tenant.repository.TenantRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtre JWT (SAD 6.5, 6.6, 6.8).
 *
 * Extrait le token du header Authorization: Bearer <token>,
 * le valide, bind le tenant dans TenantContext, et construit
 * l'Authentication Spring Security avec les roles RBAC.
 *
 * Registered only via SecurityConfig.addFilterBefore (not as @Component
 * to avoid double registration outside the security chain).
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TenantRepository tenantRepository;

    public JwtAuthenticationFilter(JwtService jwtService, TenantRepository tenantRepository) {
        this.jwtService = jwtService;
        this.tenantRepository = tenantRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();

        if (path.startsWith("/api/auth/") || path.startsWith("/api/admin/tenants") || path.startsWith("/uploads/")) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        if (!jwtService.isValid(token)) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid or expired token");
            return;
        }

        try {
            UUID tenantId = jwtService.extractTenantId(token);
            Tenant tenant = tenantRepository.findById(tenantId).orElse(null);
            if (tenant == null || tenant.getStatus() != TenantStatus.ACTIVE) {
                response.sendError(HttpStatus.FORBIDDEN.value(), "Tenant not active");
                return;
            }
            TenantContext.setTenantId(tenantId);

            List<String> roles = jwtService.extractRoles(token);
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                    .toList();
            UUID userId = jwtService.extractUserId(token);
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);

            chain.doFilter(request, response);
        } catch (Exception e) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Token parsing failed");
            return;
        } finally {
            TenantContext.clear();
        }
    }
}
