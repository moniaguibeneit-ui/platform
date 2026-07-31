import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
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
    ProductFormComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['product', 'price', 'volume', 'status', 'actions'];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(result).subscribe(() => this.loadProducts());
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
    alert(`Product: ${product.name}\nBrand: ${product.brand}\nPrice: $${product.price}\nVolume: ${product.volume}\nFragrance Notes: ${product.fragranceNotes}`);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this perfume?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
}