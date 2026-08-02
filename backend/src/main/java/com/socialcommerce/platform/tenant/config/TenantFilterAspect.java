package com.socialcommerce.platform.tenant.config;

import com.socialcommerce.platform.tenant.context.TenantContext;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Aspect
@Component
public class TenantFilterAspect {

    @PersistenceContext
    private EntityManager entityManager;

    @Before("@annotation(transactional) || @within(transactional)")
    public void enableTenantFilter(Transactional transactional) {
        if (!TenantContext.isSet()) return;
        Session session = entityManager.unwrap(Session.class);
        if (session.getEnabledFilter("tenant") != null) return;
        UUID tenantId = TenantContext.getTenantId();
        session.enableFilter("tenant").setParameter("tenantId", tenantId);
    }
}
