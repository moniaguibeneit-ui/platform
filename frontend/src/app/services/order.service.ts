import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderRequest, OrderStatus } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  list(tenantId?: string): Observable<Order[]> {
    const url = tenantId ? `${this.apiUrl}?tenantId=${tenantId}` : this.apiUrl;
    return this.http.get<Order[]>(url);
  }

  get(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getByOrderNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/number/${orderNumber}`);
  }

  create(req: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, req);
  }

  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCustomerOrders(customerPhone: string, tenantId?: string): Observable<Order[]> {
    const url = tenantId 
      ? `${this.apiUrl}/customer/${customerPhone}?tenantId=${tenantId}`
      : `${this.apiUrl}/customer/${customerPhone}`;
    return this.http.get<Order[]>(url);
  }

  getTenantOrders(tenantId: string, status?: OrderStatus): Observable<Order[]> {
    const url = status 
      ? `${this.apiUrl}/tenant/${tenantId}?status=${status}`
      : `${this.apiUrl}/tenant/${tenantId}`;
    return this.http.get<Order[]>(url);
  }
}
