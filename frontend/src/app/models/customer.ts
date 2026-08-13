export interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  tenantId?: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerCreateRequest {
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

export interface CustomerUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
