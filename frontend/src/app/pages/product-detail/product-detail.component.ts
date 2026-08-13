import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { TenantService } from '../../services/tenant.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { Tenant } from '../../models/tenant';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="product-detail-container">
      @if (loading) {
        <div class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!loading && product) {
        <div class="product-detail">
          <!-- Product Images -->
          <div class="product-images">
            <div class="main-image">
              <img *ngIf="currentImage" [src]="currentImage" [alt]="product.name" />
              <div *ngIf="!currentImage" class="image-placeholder">
                {{ product.name.charAt(0) }}
              </div>
              @if (!product.inStock) {
                <div class="out-of-stock-badge">Out of Stock</div>
              }
            </div>
            @if (product.images && product.images.length > 1) {
              <div class="thumbnail-list">
                @for (image of product.images; track image) {
                  <div 
                    class="thumbnail" 
                    [class.active]="currentImage === image"
                    (click)="currentImage = image">
                    <img [src]="image" [alt]="'Thumbnail'" />
                  </div>
                }
              </div>
            }
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <div class="merchant-info">
              <img *ngIf="tenant && tenant.logo" [src]="tenant.logo" class="merchant-logo" />
              <div *ngIf="!tenant || !tenant.logo" class="merchant-logo-placeholder">
                {{ tenant?.name?.charAt(0) || '?' }}
              </div>
              <div class="merchant-details">
                <span class="merchant-name">{{ tenant?.name || 'Unknown Merchant' }}</span>
                @if (tenant && tenant.verified) {
                  <span class="verified-badge">
                    <mat-icon>verified</mat-icon>
                    Verified
                  </span>
                }
              </div>
            </div>

            <h1 class="product-name">{{ product.name }}</h1>
            <p class="product-brand">{{ product.brand || '' }}</p>
            
            <div class="product-price">
              <span class="price">\${{ product.price.toFixed(2) }}</span>
              @if (product.volume) {
                <span class="volume">/ {{ product.volume }}</span>
              }
            </div>

            @if (product.category) {
              <div class="product-category">
                <mat-chip color="primary">{{ product.category }}</mat-chip>
              </div>
            }

            @if (product.fragranceNotes) {
              <div class="product-notes">
                <h3>Fragrance Notes</h3>
                <p>{{ product.fragranceNotes }}</p>
              </div>
            }

            @if (product.description) {
              <div class="product-description">
                <h3>Description</h3>
                <p>{{ product.description }}</p>
              </div>
            }

            <div class="stock-info">
              <div class="stock-status" [class.in-stock]="product.inStock" [class.out-of-stock]="!product.inStock">
                <mat-icon>{{ product.inStock ? 'check_circle' : 'cancel' }}</mat-icon>
                <span>{{ product.inStock ? 'In Stock' : 'Out of Stock' }}</span>
              </div>
              @if (product.stockQuantity !== undefined) {
                <span class="stock-quantity">{{ product.stockQuantity }} available</span>
              }
            </div>

            <div class="action-buttons">
              <button 
                mat-flat-button 
                color="primary" 
                class="add-to-cart-btn"
                (click)="addToCart()"
                [disabled]="!product.inStock">
                <mat-icon>add_shopping_cart</mat-icon>
                {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
              </button>
              <button mat-stroked-button class="back-btn" (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Back to Store
              </button>
            </div>
          </div>
        </div>
      }

      @if (!loading && !product) {
        <div class="error-message">
          <mat-icon class="error-icon">error</mat-icon>
          <h2>Product Not Found</h2>
          <p>This product doesn't exist or has been removed.</p>
          <button mat-raised-button color="primary" (click)="goBack()">Back to Store</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .product-images {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .main-image {
      position: relative;
      width: 100%;
      height: 400px;
      border-radius: 12px;
      overflow: hidden;
      background: var(--mat-sys-surface-container-low);
    }

    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
      font-weight: 700;
      color: var(--mat-sys-on-surface-variant);
    }

    .out-of-stock-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      padding: 8px 16px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 600;
    }

    .thumbnail-list {
      display: flex;
      gap: 8px;
      overflow-x: auto;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      flex-shrink: 0;
    }

    .thumbnail.active {
      border-color: var(--mat-sys-primary);
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .merchant-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--mat-sys-surface-container-low);
      border-radius: 8px;
    }

    .merchant-logo {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
    }

    .merchant-logo-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
    }

    .merchant-details {
      display: flex;
      flex-direction: column;
    }

    .merchant-name {
      font-weight: 600;
      font-size: 14px;
    }

    .verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--mat-sys-primary);
    }

    .product-name {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      line-height: 1.2;
    }

    .product-brand {
      margin: 0;
      font-size: 18px;
      color: var(--mat-sys-on-surface-variant);
    }

    .product-price {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .price {
      font-size: 36px;
      font-weight: 700;
      color: var(--mat-sys-primary);
    }

    .volume {
      font-size: 16px;
      color: var(--mat-sys-on-surface-variant);
    }

    .product-category {
      margin: 8px 0;
    }

    .product-notes,
    .product-description {
      padding: 16px;
      background: var(--mat-sys-surface-container-low);
      border-radius: 8px;
    }

    .product-notes h3,
    .product-description h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .product-notes p,
    .product-description p {
      margin: 0;
      line-height: 1.6;
      color: var(--mat-sys-on-surface-variant);
    }

    .stock-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
    }

    .stock-status.in-stock {
      background: var(--mat-sys-success-container);
      color: var(--mat-sys-on-success-container);
    }

    .stock-status.out-of-stock {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }

    .stock-quantity {
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    .add-to-cart-btn {
      flex: 1;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }

    .back-btn {
      height: 48px;
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
      .product-detail-container {
        padding: 12px;
      }

      .product-detail {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .main-image {
        height: 300px;
      }

      .product-name {
        font-size: 24px;
      }

      .product-brand {
        font-size: 16px;
      }

      .price {
        font-size: 28px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .add-to-cart-btn,
      .back-btn {
        width: 100%;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private tenantService = inject(TenantService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  product: Product | null = null;
  tenant: Tenant | null = null;
  loading = true;
  currentImage: string | null = null;

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.loading = false;
    }
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.currentImage = product.imageUrl || (product.images && product.images.length > 0 ? product.images[0] : null);
        
        // Load tenant info
        if (product.tenantId) {
          this.tenantService.get(product.tenantId).subscribe({
            next: (tenant) => {
              this.tenant = tenant;
            }
          });
        }
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.product || !this.tenant) return;

    try {
      this.cartService.setTenantInfo(
        this.tenant.id,
        this.tenant.name,
        this.tenant.logo
      );

      this.cartService.addToCart({
        tenantId: this.tenant.id,
        productId: this.product.id!,
        productName: this.product.name,
        productImage: this.currentImage || undefined,
        brand: this.product.brand,
        unitPrice: this.product.price,
        quantity: 1,
        inStock: this.product.inStock,
        stockQuantity: this.product.stockQuantity
      });

      this.snackBar.open('Added to cart', 'Close', { duration: 2000 });
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to add to cart', 'Close', { duration: 2000 });
    }
  }

  goBack(): void {
    if (this.tenant) {
      this.router.navigate(['/store', this.tenant.domain]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
