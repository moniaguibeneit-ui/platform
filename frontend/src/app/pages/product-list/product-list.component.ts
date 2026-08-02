import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductViewDialogComponent } from '../../components/product-view-dialog/product-view-dialog.component';
import { Product } from '../../models/product';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ProductFormComponent,
    ProductViewDialogComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['product', 'price', 'volume', 'status', 'actions'];
  loading = false;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => { this.snackBar.open('Failed to load products', 'Close', { duration: 3000 }); this.loading = false; }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result).subscribe({
          next: () => { this.snackBar.open('Product added', 'Close', { duration: 3000 }); this.loadProducts(); },
          error: () => this.snackBar.open('Failed to add product', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { mode: 'edit', product: { ...product } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(result).subscribe(() => this.loadProducts());
      }
    });
  }

  viewProduct(product: Product): void {
    this.dialog.open(ProductViewDialogComponent, {
      width: '500px',
      data: product,
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => { this.snackBar.open('Product deleted', 'Close', { duration: 3000 }); this.loadProducts(); },
        error: () => this.snackBar.open('Failed to delete product', 'Close', { duration: 3000 }),
      });
    }
  }
}
