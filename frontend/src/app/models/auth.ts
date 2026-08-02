export interface LoginRequest {
  email: string;
  password: string;
  tenantId: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: string;
  email: string;
  tenantId: string;
  roles: string[];
}

export interface AuthState {
  token: string | null;
  email: string | null;
  tenantId: string | null;
  roles: string[];
}
