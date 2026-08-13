package com.socialcommerce.platform.tenant.web;

import com.socialcommerce.platform.tenant.dto.TenantResponse;
import com.socialcommerce.platform.tenant.service.TenantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/tenants")
public class PublicTenantController {

    private final TenantService tenantService;

    public PublicTenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping("/domain/{domain}")
    public ResponseEntity<TenantResponse> getByDomain(@PathVariable String domain) {
        try {
            TenantResponse tenant = tenantService.findByDomain(domain);
            return ResponseEntity.ok(tenant);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenantResponse> getById(@PathVariable UUID id) {
        try {
            TenantResponse tenant = tenantService.findById(id);
            return ResponseEntity.ok(tenant);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}