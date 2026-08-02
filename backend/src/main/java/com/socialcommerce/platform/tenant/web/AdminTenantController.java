package com.socialcommerce.platform.tenant.web;

import com.socialcommerce.platform.tenant.dto.TenantCreateRequest;
import com.socialcommerce.platform.tenant.dto.TenantResponse;
import com.socialcommerce.platform.tenant.dto.TenantUpdateRequest;
import com.socialcommerce.platform.tenant.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/tenants")
public class AdminTenantController {

    private final TenantService tenantService;

    public AdminTenantController(TenantService tenantService) { this.tenantService = tenantService; }

    @GetMapping
    public List<TenantResponse> list() { return tenantService.findAll(); }

    @GetMapping("/{id}")
    public TenantResponse get(@PathVariable UUID id) { return tenantService.findById(id); }

    @PostMapping
    public ResponseEntity<TenantResponse> create(@Valid @RequestBody TenantCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tenantService.create(request));
    }

    @PutMapping("/{id}")
    public TenantResponse update(@PathVariable UUID id, @Valid @RequestBody TenantUpdateRequest request) {
        return tenantService.update(id, request);
    }

    @PostMapping("/{id}/activate")
    public TenantResponse activate(@PathVariable UUID id) { return tenantService.activate(id); }

    @PostMapping("/{id}/suspend")
    public TenantResponse suspend(@PathVariable UUID id) { return tenantService.suspend(id); }

    @PostMapping("/{id}/terminate")
    public TenantResponse terminate(@PathVariable UUID id) { return tenantService.terminate(id); }
}
