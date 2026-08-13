import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="cart-dialog">
      <div class="cart-header">
        <h2 mat-dialog-title>Shopping Cart</h2>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div mat-dialog-content class="cart-content">
        @if (cart) {
          <div class="merchant-info">
            <img *ngIf="cart.tenantLogo" [src]="cart.tenantLogo" class="merchant-logo" />
            <span class="merchant-name">{{ cart.tenantName }}</span>
          </div>

          <div class="cart-items">
            @for (item of cart.items; track item.productId) {
              <div class="cart-item">
                <img *ngIf="item.productImage" [src]="item.productImage" class="item-image" />
                <div *ngIf="!item.productImage" class="item-placeholder">{{ item.productName.charAt(0) }}</div>
                
                <div class="item-details">
                  <h4 class="item-name">{{ item.productName }}</h4>
                  <p class="item-brand">{{ item.brand || '' }}</p>
                  <p class="item-price">\${{ item.unitPrice.toFixed(2) }}</p>
                </div>

                <div class="item-quantity">
                  <button mat-icon-button (click)="updateQuantity(item, -1)" [disabled]="item.quantity <= 1">
                    <mat-icon>remove</mat-icon>
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button mat-icon-button (click)="updateQuantity(item, 1)" [disabled]="!item.inStock || (item.stockQuantity && item.quantity >= item.stockQuantity)">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>

                <div class="item-total">
                  <p class="total">\${{ item.lineTotal.toFixed(2) }}</p>
                  <button mat-icon-button color="warn" (click)="removeItem(item)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>

          @if (!item.inStock) {
            <div class="stock-warning">
              <mat-icon>warning</mat-icon>
              <span>Some items are out of stock</span>
            </div>
          }
        }
      </div>

      <div mat-dialog-actions class="cart-actions">
        @if (cart) {
          <div class="cart-summary">
            <div class="summary-row">
              <span>Total Items:</span>
              <span>{{ cart.totalItems }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span class="total-amount">\${{ cart.totalAmount.toFixed(2) }}</span>
            </div>
          </div>
          <button mat-flat-button color="primary" (click)="proceedToCheckout()" [disabled]="!cart || cart.items.length === 0" class="checkout-btn">
            <mat-icon>shopping_bag</mat-icon>
            Proceed to Checkout
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-dialog {
      padding: 0;
    }

    .cart-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .cart-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .close-btn {
      width: 36px;
      height: 36px;
    }

    .cart-content {
      padding: 0;
      max-height: 60vh;
      overflow-y: auto;
    }

    .merchant-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: var(--mat-sys-surface-container-low);
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .merchant-logo {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      object-fit: cover;
    }

    .merchant-name {
      font-weight: 600;
      font-size: 15px;
    }

    .cart-items {
      padding: 16px 20px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 12px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      object-fit: cover;
    }

    .item-placeholder {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
    }

    .item-details h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
    }

    .item-brand {
      margin: 0 0 4px 0;
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .item-price {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--mat-sys-primary);
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .item-quantity button {
      width: 32px;
      height: 32px;
    }

    .quantity {
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }

    .item-total {
      text-align: right;
    }

    .item-total .total {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .stock-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      font-size: 13px;
    }

    .cart-actions {
      flex-direction: column;
      padding: 16px 20px;
      border-top: 1px solid rgba(0,0,0,0.1);
    }

    .cart-summary {
      width: 100%;
      margin-bottom: 12px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }

    .summary-row.total {
      font-size: 16px;
      font-weight: 600;
      border-top: 1px solid rgba(0,0,0,0.1);
      margin-top: 8px;
      padding-top: 12px;
    }

    .total-amount {
      font-size: 18px;
      color: var(--mat-sys-primary);
    }

    .checkout-btn {
      width: 100%;
      height: 48px;
      font-size: 15px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        gap: 8px;
      }

      .item-quantity {
        grid-column: 2;
        justify-content: flex-start;
      }

      .item-total {
        grid-column: 1 / -1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  `]
})
export class CartDialogComponent {
  private cartService = inject(CartService);
  private dialogRef = inject(MatDialogRef<CartDialogComponent>);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  cart: Cart = inject(MatDialogRef<CartDialogComponent>).data as Cart;

  close(): void {
    this.dialogRef.close();
  }

  updateQuantity(item: CartItem, change: number): void {
    try {
      const newQuantity = item.quantity + change;
      this.cartService.updateItemQuantity(item.productId, newQuantity);
      this.cart = this.cartService.getCart()!;
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to update quantity', 'Close', { duration: 2000 });
    }
  }

  removeItem(item: CartItem): void {
    if (confirm(`Remove ${item.productName} from cart?`)) {
      this.cartService.removeItem(item.productId);
      this.cart = this.cartService.getCart()!;
      
      if (this.cart.items.length === 0) {
        this.close();
      }
    }
  }

  proceedToCheckout(): void {
    this.close();
    this.router.navigate(['/checkout']);
  }
}
