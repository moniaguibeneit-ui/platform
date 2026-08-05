export interface Role {
  id: string;
  name: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  active: boolean;
  roles: RoleSummary[];
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleSummary {
  id: string;
  name: string;
}

export interface UserRequest {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  active?: boolean;
  roleIds?: string[];
}
