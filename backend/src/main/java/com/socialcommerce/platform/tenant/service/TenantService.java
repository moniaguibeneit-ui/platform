package com.socialcommerce.platform.tenant.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.socialcommerce.platform.tenant.dto.TenantCreateRequest;
import com.socialcommerce.platform.tenant.dto.TenantResponse;
import com.socialcommerce.platform.tenant.dto.TenantUpdateRequest;
import com.socialcommerce.platform.tenant.entity.SubscriptionPlan;
import com.socialcommerce.platform.tenant.entity.SubscriptionStatus;
import com.socialcommerce.platform.tenant.entity.Tenant;
import com.socialcommerce.platform.tenant.entity.TenantStatus;
import com.socialcommerce.platform.tenant.entity.TenantSubscription;
import com.socialcommerce.platform.tenant.repository.TenantRepository;
import com.socialcommerce.platform.tenant.repository.TenantSubscriptionRepository;
import com.socialcommerce.platform.user.entity.Role;
import com.socialcommerce.platform.user.repository.RoleRepository;

import jakarta.persistence.EntityNotFoundException;

/**
 * Tenant management service (SAD 4.7, 4.8).
 *
 * On tenant creation, bootstraps:
 * - An ACTIVE subscription
 * - Default RBAC roles: ADMIN, MANAGER, COMMERCIAL, STOCK_MANAGER, ACCOUNTANT
 */
@Service
@Transactional
public class TenantService {

    private static final String[] DEFAULT_ROLES = {
            "ADMIN", "MANAGER", "COMMERCIAL", "STOCK_MANAGER", "ACCOUNTANT"
    };

    private final TenantRepository tenantRepository;
    private final TenantSubscriptionRepository subscriptionRepository;
    private final RoleRepository roleRepository;

    public TenantService(TenantRepository tenantRepository,
                         TenantSubscriptionRepository subscriptionRepository,
                         RoleRepository roleRepository) {
        this.tenantRepository = tenantRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<TenantResponse> findAll() {
        return tenantRepository.findAll().stream().map(TenantResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TenantResponse findById(UUID id) {
        return tenantRepository.findById(id).map(TenantResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Tenant " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public TenantResponse findByDomain(String domain) {
        return tenantRepository.findByDomain(domain)
                .filter(t -> t.getActive() && t.getStatus() == TenantStatus.ACTIVE)
                .map(TenantResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Store not found: " + domain));
    }

    public TenantResponse create(TenantCreateRequest request) {
        if (tenantRepository.findByDomain(request.domain()).isPresent()) {
            throw new IllegalArgumentException("Domain already in use: " + request.domain());
        }
        SubscriptionPlan plan = request.subscriptionPlan() != null ? request.subscriptionPlan() : SubscriptionPlan.STARTER;
        Tenant tenant = Tenant.builder().name(request.name()).domain(request.domain())
                .subscriptionPlan(plan).status(TenantStatus.ACTIVE).active(true).build();
        tenant = tenantRepository.save(tenant);

        // Bootstrap subscription
        LocalDateTime now = LocalDateTime.now();
        TenantSubscription sub = TenantSubscription.builder()
                .tenantId(tenant.getId()).plan(plan).status(SubscriptionStatus.ACTIVE).startedAt(now).build();
        subscriptionRepository.save(sub);

        // Bootstrap default RBAC roles (SAD 4.8, 6.7)
        for (String roleName : DEFAULT_ROLES) {
            Role role = Role.builder()
                    .tenantId(tenant.getId())
                    .name(roleName)
                    .build();
            roleRepository.save(role);
        }

        return TenantResponse.from(tenant);
    }

    public TenantResponse update(UUID id, TenantUpdateRequest request) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tenant " + id + " not found"));
        if (request.name() != null && !request.name().isBlank()) tenant.setName(request.name());
        if (request.domain() != null && !request.domain().isBlank()) {
            tenantRepository.findByDomain(request.domain()).filter(o -> !o.getId().equals(id))
                    .ifPresent(o -> { throw new IllegalArgumentException("Domain already in use: " + request.domain()); });
            tenant.setDomain(request.domain());
        }
        return TenantResponse.from(tenantRepository.save(tenant));
    }

    public TenantResponse activate(UUID id) { return setStatus(id, TenantStatus.ACTIVE, true); }
    public TenantResponse suspend(UUID id) { return setStatus(id, TenantStatus.SUSPENDED, false); }
    public TenantResponse terminate(UUID id) { return setStatus(id, TenantStatus.TERMINATED, false); }

    private TenantResponse setStatus(UUID id, TenantStatus status, boolean active) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tenant " + id + " not found"));
        tenant.setStatus(status);
        tenant.setActive(active);
        return TenantResponse.from(tenantRepository.save(tenant));
    }
}
