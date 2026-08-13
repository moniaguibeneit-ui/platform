export interface Tenant {
  id: string;
  name: string;
  domain: string;
  subscriptionPlan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  active: boolean;
  createdAt: string;
  updatedAt: string;
  // Merchant profile fields
  logo?: string;
  coverImage?: string;
  description?: string;
  story?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  openingHours?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  verified: boolean;
}

export interface TenantCreateRequest {
  name: string;
  domain: string;
  subscriptionPlan?: 'STARTER' | 'PRO' | 'ENTERPRISE';
}

export interface TenantUpdateRequest {
  name?: string;
  domain?: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  story?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  openingHours?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}
