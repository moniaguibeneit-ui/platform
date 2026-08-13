import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="checkout-container">
      <div class="checkout-header">
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to Store
        </button>
        <h1>Checkout</h1>
      </div>

      @if (loading) {
        <div class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!loading && cart) {
        <div class="checkout-content">
          <div class="checkout-main">
            <!-- Customer Information -->
            <mat-card class="checkout-section">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>person</mat-icon>
                  Customer Information
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="checkoutForm" class="checkout-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Full Name *</mat-label>
                      <input matInput formControlName="customerName" placeholder="John Doe" required>
                      <mat-error *ngIf="checkoutForm.get('customerName')?.hasError('required')">Name is required</mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Phone Number *</mat-label>
                      <input matInput formControlName="customerPhone" placeholder="+1 234 567 8900" required>
                      <mat-error *ngIf="checkoutForm.get('customerPhone')?.hasError('required')">Phone is required</mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Delivery Address *</mat-label>
                      <textarea matInput formControlName="customerAddress" rows="3" placeholder="123 Main St, City, Country" required></textarea>
                      <mat-error *ngIf="checkoutForm.get('customerAddress')?.hasError('required')">Address is required</mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Email (Optional)</mat-label>
                      <input matInput formControlName="customerEmail" placeholder="john@example.com">
                      <mat-error *ngIf="checkoutForm.get('customerEmail')?.hasError('email')">Invalid email</mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Order Notes (Optional)</mat-label>
                      <textarea matInput formControlName="notes" rows="2" placeholder="Any special instructions..."></textarea>
                    </mat-form-field>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>

            <!-- Payment Method -->
            <mat-card class="checkout-section">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>payment</mat-icon>
                  Payment Method
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="payment-methods">
                  <mat-radio-group formControlName="paymentMethod">
                    <mat-radio-button value="CASH_ON_DELIVERY" [disabled]="true" checked>
                      <div class="payment-option">
                        <mat-icon>payments</mat-icon>
                        <div class="payment-details">
                          <span class="payment-name">Cash on Delivery</span>
                          <span class="payment-desc">Pay when your order arrives</span>
                        </div>
                      </div>
                    </mat-radio-button>
                  </mat-radio-group>
                </div>
                <div class="payment-note">
                  <mat-icon>info</mat-icon>
                  <span>Cash on Delivery is currently the only payment method available.</span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Order Summary -->
          <div class="checkout-sidebar">
            <mat-card class="order-summary">
              <mat-card-header>
                <mat-card-title>Order Summary</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="merchant-info">
                  <img *ngIf="cart.tenantLogo" [src]="cart.tenantLogo" class="merchant-logo" />
                  <span class="merchant-name">{{ cart.tenantName }}</span>
                </div>

                <div class="order-items">
                  @for (item of cart.items; track item.productId) {
                    <div class="summary-item">
                      <div class="item-info">
                        <span class="item-name">{{ item.productName }}</span>
                        <span class="item-qty">x{{ item.quantity }}</span>
                      </div>
                      <span class="item-price">\${{ item.lineTotal.toFixed(2) }}</span>
                    </div>
                  }
                </div>

                <div class="order-totals">
                  <div class="total-row">
                    <span>Subtotal ({{ cart.totalItems }} items)</span>
                    <span>\${{ cart.totalAmount.toFixed(2) }}</span>
                  </div>
                  <div class="total-row">
                    <span>Delivery Fee</span>
                    <span>Calculated by merchant</span>
                  </div>
                  <div class="total-row final">
                    <span>Total</span>
                    <span class="total-amount">\${{ cart.totalAmount.toFixed(2) }}</span>
                  </div>
                </div>

                <button 
                  mat-flat-button 
                  color="primary" 
                  class="place-order-btn"
                  (click)="placeOrder()"
                  [disabled]="checkoutForm.invalid || placingOrder">
                  @if (placingOrder) {
                    <ng-container>
                      <mat-spinner diameter="20" class="btn-spinner"></mat-spinner>
                      <span>Placing Order...</span>
                    </ng-container>
                  } @else {
                    <ng-container>
                      <mat-icon>check_circle</mat-icon>
                      <span>Place Order</span>
                    </ng-container>
                  }
                </button>

                <div class="terms-agreement">
                  <p>By placing this order, you agree to our Terms & Conditions and Privacy Policy.</p>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }

      @if (!loading && !cart) {
        <div class="empty-cart">
          <mat-icon class="empty-icon">shopping_cart</mat-icon>
          <h2>Your cart is empty</h2>
          <p>Add some products to checkout</p>
          <button mat-raised-button color="primary" (click)="goBack()">Browse Products</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .checkout-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .checkout-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
    }

    .checkout-main {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .checkout-section {
      border-radius: 12px;
    }

    .checkout-section mat-card-header {
      padding-bottom: 0;
    }

    .checkout-section mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      margin-bottom: 8px;
    }

    .full-width {
      width: 100%;
    }

    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .payment-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .payment-details {
      display: flex;
      flex-direction: column;
    }

    .payment-name {
      font-weight: 600;
      font-size: 14px;
    }

    .payment-desc {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .payment-note {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: var(--mat-sys-primary-container);
      border-radius: 8px;
      font-size: 13px;
      color: var(--mat-sys-on-primary-container);
    }

    .checkout-sidebar {
      position: sticky;
      top: 20px;
      height: fit-content;
    }

    .order-summary {
      border-radius: 12px;
    }

    .merchant-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--mat-sys-surface-container-low);
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .merchant-logo {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
    }

    .merchant-name {
      font-weight: 600;
      font-size: 14px;
    }

    .order-items {
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 16px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .item-info {
      display: flex;
      flex-direction: column;
    }

    .item-name {
      font-size: 14px;
      font-weight: 500;
    }

    .item-qty {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .item-price {
      font-weight: 600;
      font-size: 14px;
    }

    .order-totals {
      border-top: 1px solid rgba(0,0,0,0.1);
      padding-top: 12px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }

    .total-row.final {
      font-size: 16px;
      font-weight: 600;
      border-top: 1px solid rgba(0,0,0,0.06);
      margin-top: 8px;
      padding-top: 12px;
    }

    .total-amount {
      font-size: 20px;
      color: var(--mat-sys-primary);
    }

    .place-order-btn {
      width: 100%;
      height: 48px;
      margin-top: 16px;
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-spinner {
      display: inline-block;
    }

    .terms-agreement {
      margin-top: 16px;
      text-align: center;
    }

    .terms-agreement p {
      margin: 0;
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mat-sys-primary);
      opacity: 0.3;
      margin-bottom: 16px;
    }

    .empty-cart h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
    }

    .empty-cart p {
      margin: 0 0 24px 0;
      color: var(--mat-sys-on-surface-variant);
    }

    @media (max-width: 768px) {
      .checkout-container {
        padding: 12px;
      }

      .checkout-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .checkout-header h1 {
        font-size: 22px;
      }

      .checkout-content {
        grid-template-columns: 1fr;
      }

      .checkout-sidebar {
        position: static;
      }

      .order-summary {
        position: sticky;
        bottom: 0;
        z-index: 10;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  cart: Cart | null = null;
  loading = true;
  placingOrder = false;

  checkoutForm: FormGroup = this.fb.group({
    customerName: ['', Validators.required],
    customerPhone: ['', Validators.required],
    customerAddress: ['', Validators.required],
    customerEmail: ['', [Validators.email]],
    notes: [''],
    paymentMethod: ['CASH_ON_DELIVERY']
  });

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    this.loading = false;

    if (!this.cart || this.cart.items.length === 0) {
      this.snackBar.open('Your cart is empty', 'Close', { duration: 2000 });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  placeOrder(): void {
    if (!this.cart || this.checkoutForm.invalid) return;

    this.placingOrder = true;

    const orderRequest = {
      customerName: this.checkoutForm.value.customerName,
      customerPhone: this.checkoutForm.value.customerPhone,
      customerAddress: this.checkoutForm.value.customerAddress,
      customerEmail: this.checkoutForm.value.customerEmail,
      notes: this.checkoutForm.value.notes,
      items: this.cart.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      paymentMethod: 'CASH_ON_DELIVERY' as const
    };

    this.orderService.create(orderRequest).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/order-confirmation', order.orderNumber]);
      },
      error: (error) => {
        this.snackBar.open(error.error?.error || 'Failed to place order', 'Close', { duration: 3000 });
        this.placingOrder = false;
      }
    });
  }
}
