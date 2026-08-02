import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private readonly TOKEN_KEY = 'platform_jwt_token';
  private readonly EMAIL_KEY = 'platform_user_email';
  private readonly TENANT_KEY = 'platform_tenant_id';
  private readonly ROLES_KEY = 'platform_user_roles';

  // Signal-based reactive state
  private _token = signal<string | null>(this.readStorage(this.TOKEN_KEY));
  private _email = signal<string | null>(this.readStorage(this.EMAIL_KEY));
  private _tenantId = signal<string | null>(this.readStorage(this.TENANT_KEY));
  private _roles = signal<string[]>(this.readRoles());

  readonly token = this._token.asReadonly();
  readonly email = this._email.asReadonly();
  readonly tenantId = this._tenantId.asReadonly();
  readonly roles = this._roles.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, req).pipe(
      tap((res) => this.setSession(res))
    );
  }

  register(email: string, password: string, tenantId: string, firstName?: string, lastName?: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, {
      email, password, tenantId, firstName, lastName,
    }).pipe(tap((res) => this.setSession(res)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.TENANT_KEY);
    localStorage.removeItem(this.ROLES_KEY);
    this._token.set(null);
    this._email.set(null);
    this._tenantId.set(null);
    this._roles.set([]);
  }

  getToken(): string | null {
    return this._token();
  }

  private setSession(res: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.EMAIL_KEY, res.email);
    localStorage.setItem(this.TENANT_KEY, res.tenantId);
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(res.roles || []));
    this._token.set(res.token);
    this._email.set(res.email);
    this._tenantId.set(res.tenantId);
    this._roles.set(res.roles || []);
  }

  private readStorage(key: string): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  }

  private readRoles(): string[] {
    const raw = this.readStorage(this.ROLES_KEY);
    try { return raw ? JSON.parse(raw) : []; } catch { return []; }
  }
}
