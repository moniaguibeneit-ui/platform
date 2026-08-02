import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tenant, TenantCreateRequest, TenantUpdateRequest } from '../models/tenant';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/tenants`;

  list(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.apiUrl);
  }

  get(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/${id}`);
  }

  create(req: TenantCreateRequest): Observable<Tenant> {
    return this.http.post<Tenant>(this.apiUrl, req);
  }

  update(id: string, req: TenantUpdateRequest): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/${id}`, req);
  }

  activate(id: string): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.apiUrl}/${id}/activate`, {});
  }

  suspend(id: string): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.apiUrl}/${id}/suspend`, {});
  }

  terminate(id: string): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.apiUrl}/${id}/terminate`, {});
  }
}
