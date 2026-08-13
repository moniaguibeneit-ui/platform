import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerCreateRequest, CustomerUpdateRequest } from '../models/customer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  getCustomers(tenantId?: string): Observable<Customer[]> {
    const url = tenantId ? `${this.apiUrl}?tenantId=${tenantId}` : this.apiUrl;
    return this.http.get<Customer[]>(url);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  addCustomer(customer: CustomerCreateRequest): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: string, customer: CustomerUpdateRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchCustomers(query: string, tenantId?: string): Observable<Customer[]> {
    const url = tenantId 
      ? `${this.apiUrl}/search?q=${query}&tenantId=${tenantId}`
      : `${this.apiUrl}/search?q=${query}`;
    return this.http.get<Customer[]>(url);
  }
}
