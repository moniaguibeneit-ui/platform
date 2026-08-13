import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="order-tracking-container">
      <div class="tracking-header">
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
        <h1>Track Your Order</h1>
      </div>

      <!-- Search by Order Number -->
      <mat-card class="search-card">
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="searchOrder()">
            <div class="search-form">
              <mat-form-field appearance="outline" class="search-input">
                <mat-label>Enter Order Number</mat-label>
                <input matInput formControlName="orderNumber" placeholder="e.g. ORD-12345">
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit" [disabled]="searchForm.invalid || searching">
                @if (searching) {
                  <ng-container>
                    <mat-spinner diameter="20"></mat-spinner>
                  </ng-container>
                } @else {
                  <ng-container>
                    <mat-icon>search</mat-icon>
                    <span>Track</span>
                  </ng-container>
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      @if (loading) {
        <div class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!loading && order) {
        <div class="tracking-content">
          <!-- Order Status Timeline -->
          <mat-card class="status-timeline">
            <mat-card-header>
              <mat-card-title>Order Status</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="timeline">
                <div class="timeline-item" [class.completed]="isStatusCompleted('PENDING')" [class.current]="order.status === 'PENDING'">
                  <div class="timeline-marker">
                    <mat-icon>schedule</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-title">Order Placed</span>
                    <span class="timeline-desc">Your order has been received</span>
                  </div>
                </div>

                <div class="timeline-item" [class.completed]="isStatusCompleted('CONFIRMED')" [class.current]="order.status === 'CONFIRMED'">
                  <div class="timeline-marker">
                    <mat-icon>check_circle</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-title">Order Confirmed</span>
                    <span class="timeline-desc">Merchant has confirmed your order</span>
                  </div>
                </div>

                <div class="timeline-item" [class.completed]="isStatusCompleted('PREPARING')" [class.current]="order.status === 'PREPARING'">
                  <div class="timeline-marker">
                    <mat-icon>inventory</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-title">Preparing</span>
                    <span class="timeline-desc">Your order is being prepared</span>
                  </div>
                </div>

                <div class="timeline-item" [class.completed]="isStatusCompleted('SHIPPED')" [class.current]="order.status === 'SHIPPED'">
                  <div class="timeline-marker">
                    <mat-icon>local_shipping</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-title">Shipped</span>
                    <span class="timeline-desc">Your order is on the way</span>
                  </div>
                </div>

                <div class="timeline-item" [class.completed]="isStatusCompleted('DELIVERED')" [class.current]="order.status === 'DELIVERED'">
                  <div class="timeline-marker">
                    <mat-icon>done_all</mat-icon>
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-title">Delivered</span>
                    <span class="timeline-desc">Order has been delivered</span>
                  </div>
                </div>

                @if (order.status === 'CANCELLED') {
                  <div class="timeline-item cancelled">
                    <div class="timeline-marker">
                      <mat-icon>cancel</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <span class="timeline-title">Cancelled</span>
                      <span class="timeline-desc">Order has been cancelled</span>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Order Details -->
          <mat-card class="order-details">
            <mat-card-header>
              <mat-card-title>Order Details</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="detail-row">
                <span class="label">Order Number:</span>
                <span class="value">{{ order.orderNumber }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Current Status:</span>
                <span class="value status" [class]="getStatusClass(order.status)">{{ order.status }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Total Amount:</span>
                <span class="value">\${{ order.totalAmount.toFixed(2) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">Cash on Delivery</span>
              </div>
              <div class="detail-row">
                <span class="label">Customer:</span>
                <span class="value">{{ order.customerName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">{{ order.customerPhone }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Delivery Address:</span>
                <span class="value">{{ order.customerAddress }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Order Date:</span>
                <span class="value">{{ order.createdAt | date:'medium' }}</span>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Order Items -->
          <mat-card class="order-items">
            <mat-card-header>
              <mat-card-title>Order Items</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @for (item of order.items; track item.id) {
                <div class="order-item">
                  <div class="item-info">
                    <span class="item-name">{{ item.productName }}</span>
                    <span class="item-qty">Quantity: {{ item.quantity }}</span>
                  </div>
                  <span class="item-price">\${{ item.lineTotal.toFixed(2) }}</span>
                </div>
              }
              <div class="items-total">
                <span>Total:</span>
                <span>\${{ order.totalAmount.toFixed(2) }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      }

      @if (!loading && !order && !searching) {
        <div class="no-order">
          <mat-icon class="no-order-icon">search_off</mat-icon>
          <h2>No Order Found</h2>
          <p>Enter your order number above to track your order</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .order-tracking-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .tracking-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .tracking-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    .search-card {
      margin-bottom: 24px;
      border-radius: 12px;
    }

    .search-form {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .search-input {
      flex: 1;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .tracking-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-timeline,
    .order-details,
    .order-items {
      border-radius: 12px;
    }

    .timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 0;
      position: relative;
    }

    .timeline-item:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 44px;
      bottom: 0;
      width: 2px;
      background: var(--mat-sys-outline-variant);
    }

    .timeline-item.completed::before {
      background: var(--mat-sys-primary);
    }

    .timeline-marker {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--mat-sys-surface-container);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      z-index: 1;
    }

    .timeline-item.completed .timeline-marker {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }

    .timeline-item.current .timeline-marker {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      border: 2px solid var(--mat-sys-primary);
    }

    .timeline-item.cancelled .timeline-marker {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }

    .timeline-marker mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .timeline-content {
      display: flex;
      flex-direction: column;
      padding-top: 4px;
    }

    .timeline-title {
      font-weight: 600;
      font-size: 14px;
    }

    .timeline-desc {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
    }

    .value {
      font-weight: 600;
      text-align: right;
    }

    .status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
    }

    .status.PENDING {
      background: var(--mat-sys-warning-container);
      color: var(--mat-sys-on-warning-container);
    }

    .status.CONFIRMED {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    .status.PREPARING {
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
    }

    .status.SHIPPED {
      background: var(--mat-sys-tertiary-container);
      color: var(--mat-sys-on-tertiary-container);
    }

    .status.DELIVERED {
      background: var(--mat-sys-success-container);
      color: var(--mat-sys-on-success-container);
    }

    .status.CANCELLED {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .item-info {
      display: flex;
      flex-direction: column;
    }

    .item-name {
      font-weight: 500;
      font-size: 14px;
    }

    .item-qty {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .item-price {
      font-weight: 600;
      font-size: 14px;
    }

    .items-total {
      display: flex;
      justify-content: space-between;
      padding: 16px 0 0;
      border-top: 2px solid rgba(0,0,0,0.1);
      font-size: 16px;
      font-weight: 600;
    }

    .no-order {
      text-align: center;
      padding: 60px 20px;
    }

    .no-order-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mat-sys-primary);
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .no-order h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
    }

    .no-order p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }

    @media (max-width: 768px) {
      .order-tracking-container {
        padding: 12px;
      }

      .tracking-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .tracking-header h1 {
        font-size: 22px;
      }

      .search-form {
        flex-direction: column;
        align-items: stretch;
      }

      .search-form button {
        width: 100%;
      }
    }
  `]
})
export class OrderTrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);

  order: Order | null = null;
  loading = false;
  searching = false;

  searchForm: FormGroup = this.fb.group({
    orderNumber: ['']
  });

  ngOnInit(): void {
    const orderNumber = this.route.snapshot.paramMap.get('orderNumber');
    if (orderNumber) {
      this.searchForm.patchValue({ orderNumber });
      this.searchOrder();
    }
  }

  searchOrder(): void {
    const orderNumber = this.searchForm.value.orderNumber;
    if (!orderNumber) return;

    this.searching = true;
    this.loading = true;

    this.orderService.getByOrderNumber(orderNumber).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        this.searching = false;
      },
      error: () => {
        this.order = null;
        this.loading = false;
        this.searching = false;
      }
    });
  }

  isStatusCompleted(status: string): boolean {
    if (!this.order) return false;
    
    const statusOrder = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(this.order.status);
    const checkIndex = statusOrder.indexOf(status);
    
    return currentIndex > checkIndex;
  }

  getStatusClass(status: string): string {
    return status || 'PENDING';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
