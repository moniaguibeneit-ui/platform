package com.socialcommerce.platform.user.web;

import com.socialcommerce.platform.user.dto.RoleRequest;
import com.socialcommerce.platform.user.entity.Role;
import com.socialcommerce.platform.user.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Role CRUD endpoints (tenant-scoped, SAD ÃÃÃÃÂ§4.8).
 */
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public List<Role> list() {
        return roleService.findAll();
    }

    @PostMapping
    public ResponseEntity<Role> create(@Valid @RequestBody RoleRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roleService.create(req));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        roleService.delete(id);
    }
}
