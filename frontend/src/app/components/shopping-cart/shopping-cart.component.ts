import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { CartDialogComponent } from './cart-dialog.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <button 
      mat-icon-button 
      (click)="openCart()"
      class="cart-button"
      [matBadge]="cartCount()"
      [matBadgeHidden]="cartCount() === 0"
      matBadgeColor="primary">
      <mat-icon>shopping_cart</mat-icon>
    </button>
  `,
  styles: [`
    .cart-button {
      position: relative;
    }
  `]
})
export class ShoppingCartComponent {
  private cartService = inject(CartService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  cartCount(): number {
    return this.cartService.getCartCount();
  }

  openCart(): void {
    const cart = this.cartService.getCart();
    if (!cart || cart.items.length === 0) {
      this.snackBar.open('Your cart is empty', 'Close', { duration: 2000 });
      return;
    }

    this.dialog.open(CartDialogComponent, {
      width: '100%',
      maxWidth: '500px',
      data: cart,
      position: { right: '0' },
      panelClass: 'cart-dialog'
    });
  }
}
