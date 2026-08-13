import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="order-confirmation-container">
      @if (loading) {
        <div class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!loading && order) {
        <div class="confirmation-content">
          <div class="success-message">
            <div class="success-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <h1>Order Confirmed!</h1>
            <p class="order-number">Order #{{ order.orderNumber }}</p>
          </div>

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
                <span class="label">Status:</span>
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
              @if (order.notes) {
                <div class="detail-row">
                  <span class="label">Notes:</span>
                  <span class="value">{{ order.notes }}</span>
                </div>
              }
            </mat-card-content>
          </mat-card>

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

          <div class="next-steps">
            <h3>What's Next?</h3>
            <div class="step">
              <mat-icon>schedule</mat-icon>
              <div class="step-content">
                <span class="step-title">Order Confirmation</span>
                <span class="step-desc">The merchant will confirm your order shortly</span>
              </div>
            </div>
            <div class="step">
              <mat-icon>inventory</mat-icon>
              <div class="step-content">
                <span class="step-title">Order Preparation</span>
                <span class="step-desc">Your order will be prepared for shipping</span>
              </div>
            </div>
            <div class="step">
              <mat-icon>local_shipping</mat-icon>
              <div class="step-content">
                <span class="step-title">Delivery</span>
                <span class="step-desc">Pay with cash when your order arrives</span>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button mat-raised-button color="primary" (click)="trackOrder()">
              <mat-icon>visibility</mat-icon>
              Track Order
            </button>
            <button mat-stroked-button (click)="continueShopping()">
              <mat-icon>shopping_bag</mat-icon>
              Continue Shopping
            </button>
          </div>
        </div>
      }

      @if (!loading && !order) {
        <div class="error-message">
          <mat-icon class="error-icon">error</mat-icon>
          <h2>Order Not Found</h2>
          <p>We couldn't find your order. Please check the order number or contact support.</p>
          <button mat-raised-button color="primary" (click)="goHome()">Go to Home</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .order-confirmation-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .confirmation-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .success-message {
      text-align: center;
      padding: 40px 20px;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    }

    .success-message h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .order-number {
      margin: 0;
      font-size: 18px;
      color: var(--mat-sys-primary);
      font-weight: 600;
    }

    .order-details,
    .order-items {
      border-radius: 12px;
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

    .next-steps {
      background: var(--mat-sys-surface-container-low);
      border-radius: 12px;
      padding: 24px;
    }

    .next-steps h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
    }

    .step mat-icon {
      color: var(--mat-sys-primary);
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .step-content {
      display: flex;
      flex-direction: column;
    }

    .step-title {
      font-weight: 600;
      font-size: 14px;
    }

    .step-desc {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .action-buttons button {
      flex: 1;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .error-message {
      text-align: center;
      padding: 60px 20px;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mat-sys-error);
      margin-bottom: 16px;
    }

    .error-message h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
    }

    .error-message p {
      margin: 0 0 24px 0;
      color: var(--mat-sys-on-surface-variant);
    }

    @media (max-width: 768px) {
      .order-confirmation-container {
        padding: 12px;
      }

      .success-message {
        padding: 30px 16px;
      }

      .success-icon {
        width: 64px;
        height: 64px;

        mat-icon {
          font-size: 36px;
          width: 36px;
          height: 36px;
        }
      }

      .success-message h1 {
        font-size: 22px;
      }

      .order-number {
        font-size: 16px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        width: 100%;
      }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order: Order | null = null;
  loading = true;

  ngOnInit(): void {
    const orderNumber = this.route.snapshot.paramMap.get('orderNumber');
    if (orderNumber) {
      this.orderService.getByOrderNumber(orderNumber).subscribe({
        next: (order) => {
          this.order = order;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  getStatusClass(status: string): string {
    return status || 'PENDING';
  }

  trackOrder(): void {
    if (this.order?.orderNumber) {
      this.router.navigate(['/order-tracking', this.order.orderNumber]);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
