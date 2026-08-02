export interface Tenant {
  id: string;
  name: string;
  domain: string;
  subscriptionPlan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantCreateRequest {
  name: string;
  domain: string;
  subscriptionPlan?: 'STARTER' | 'PRO' | 'ENTERPRISE';
}

export interface TenantUpdateRequest {
  name?: string;
  domain?: string;
}
