import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order';
import { OrderFormDialogComponent } from './order-form-dialog.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  orders: Order[] = [];
  displayedColumns = ['orderNumber', 'items', 'total', 'status', 'createdAt', 'actions'];
  loading = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.orderService.list().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.snackBar.open('Failed to load orders', 'Close', { duration: 3000 }); this.loading = false; },
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(OrderFormDialogComponent, {
      width: '640px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.orderService.create(result).subscribe({
          next: () => { this.snackBar.open('Order created', 'Close', { duration: 3000 }); this.load(); },
          error: (e) => this.snackBar.open(e.error?.error || 'Create failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  updateStatus(order: Order, status: OrderStatus): void {
    if (!order.id) return;
    this.orderService.updateStatus(order.id, status).subscribe({
      next: () => { this.snackBar.open(`Order marked as ${status}`, 'Close', { duration: 3000 }); this.load(); },
      error: () => this.snackBar.open('Failed to update status', 'Close', { duration: 3000 }),
    });
  }

  deleteOrder(order: Order): void {
    if (confirm(`Delete order "${order.orderNumber}"?`)) {
      if (order.id) {
        this.orderService.delete(order.id).subscribe({
          next: () => { this.snackBar.open('Order deleted', 'Close', { duration: 3000 }); this.load(); },
          error: () => this.snackBar.open('Failed to delete order', 'Close', { duration: 3000 }),
        });
      }
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-light-warning text-warning';
      case 'PAID': return 'bg-light-primary text-primary';
      case 'SHIPPED': return 'bg-light-info text-info';
      case 'DELIVERED': return 'bg-light-success text-success';
      case 'CANCELLED': return 'bg-light-error text-error';
      default: return 'bg-light-secondary text-secondary';
    }
  }

  itemCount(order: Order): number {
    return order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  }
}
