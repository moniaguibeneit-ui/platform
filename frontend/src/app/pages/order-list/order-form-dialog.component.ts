import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-order-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './order-form-dialog.component.html',
  styleUrl: './order-form-dialog.component.scss',
})
export class OrderFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<OrderFormDialogComponent>);
  private productService = inject(ProductService);
  data = inject(MAT_DIALOG_DATA) as { mode: 'create' };

  products: Product[] = [];
  selectedProductId = '';
  quantity = 1;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[] = [];

  notes = '';

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => { this.products = products; },
      error: () => {},
    });
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  }

  addItem(): void {
    const product = this.products.find(p => p.id === this.selectedProductId);
    if (!product || this.quantity < 1) return;
    this.items.push({
      productId: product.id!,
      productName: product.name,
      quantity: this.quantity,
      unitPrice: product.price,
    });
    this.selectedProductId = '';
    this.quantity = 1;
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  cancel(): void {
    this.ref.close();
  }

  submit(): void {
    if (this.items.length === 0) return;
    this.ref.close({
      notes: this.notes,
      items: this.items,
    });
  }
}
