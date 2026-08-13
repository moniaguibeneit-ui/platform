export interface Category {
  id?: string;
  name: string;
  description?: string;
  slug?: string;
  icon?: string;
  order?: number;
  active: boolean;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
  slug?: string;
  icon?: string;
  order?: number;
  active?: boolean;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string;
  slug?: string;
  icon?: string;
  order?: number;
  active?: boolean;
}
