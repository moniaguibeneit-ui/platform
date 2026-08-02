package com.socialcommerce.platform.tenant.context;

import java.util.UUID;

public final class TenantContext {

    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {}

    public static void setTenantId(UUID tenantId) { CURRENT_TENANT.set(tenantId); }
    public static UUID getTenantId() { return CURRENT_TENANT.get(); }

    public static UUID requireTenantId() {
        UUID id = CURRENT_TENANT.get();
        if (id == null) throw new IllegalStateException("No tenant context bound to the current request");
        return id;
    }

    public static boolean isSet() { return CURRENT_TENANT.get() != null; }
    public static void clear() { CURRENT_TENANT.remove(); }
}
