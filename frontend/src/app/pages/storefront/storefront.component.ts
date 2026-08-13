import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { TenantService } from '../../services/tenant.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product';
import { Tenant } from '../../models/tenant';
import { Category } from '../../models/category';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    TablerIconsModule,
    RouterModule,
  ],
  template: `
    <div class="storefront-container">
      @if (loading) {
        <div class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!loading && tenant) {
        <!-- Merchant Header -->
        <div class="merchant-header" [style.background-image]="'url(' + (tenant.coverImage || '') + ')'">
          <div class="merchant-header-overlay">
            <div class="merchant-info">
              <img *ngIf="tenant.logo" [src]="tenant.logo" class="merchant-logo" />
              <div *ngIf="!tenant.logo" class="merchant-logo-placeholder">
                {{ tenant.name.charAt(0) }}
              </div>
              <div class="merchant-details">
                <h1 class="merchant-name">{{ tenant.name }}</h1>
                @if (tenant.verified) {
                  <div class="verified-badge">
                    <i-tabler name="verified" class="icon-20"></i-tabler>
                    <span>Verified Merchant</span>
                  </div>
                }
                <p class="merchant-description">{{ tenant.description || '' }}</p>
                <div class="merchant-contact">
                  @if (tenant.contactPhone) {
                    <a [href]="'tel:' + tenant.contactPhone" class="contact-link">
                      <i-tabler name="phone" class="icon-16"></i-tabler>
                      {{ tenant.contactPhone }}
                    </a>
                  }
                  @if (tenant.contactEmail) {
                    <a [href]="'mailto:' + tenant.contactEmail" class="contact-link">
                      <i-tabler name="mail" class="icon-16"></i-tabler>
                      {{ tenant.contactEmail }}
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="store-controls">
          <div class="search-bar">
            <i-tabler name="search" class="icon-20"></i-tabler>
            <input 
              type="text" 
              placeholder="Search products..." 
              [(ngModel)]="searchQuery"
              (input)="filterProducts()"
              class="search-input">
          </div>
          <div class="filter-bar">
            <mat-select 
              placeholder="All Categories" 
              [(value)]="selectedCategory"
              (selectionChange)="filterProducts()"
              class="category-select">
              <mat-option [value]="null">All Categories</mat-option>
              @for (category of categories; track category.id) {
                <mat-option [value]="category.id">{{ category.name }}</mat-option>
              }
            </mat-select>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-section">
          <h2 class="section-title">Products</h2>
          
          @if (filteredProducts.length === 0) {
            <div class="no-products">
              <i-tabler name="package" class="icon-64"></i-tabler>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          }

          <div class="products-grid">
            @for (product of filteredProducts; track product.id) {
              <mat-card class="mat-mdc-card mdc-card cardWithShadow productcard overflow-hidden">
                <a [routerLink]="'/product/' + product.id">
                  <img 
                    *ngIf="product.imageUrl || (product.images && product.images.length > 0)" 
                    [src]="product.imageUrl || product.images![0]" 
                    [alt]="product.name" 
                    mat-card-image 
                    class="mat-mdc-card-image mdc-card__media w-100 product-card-image">
                  <div *ngIf="!product.imageUrl && !(product.images && product.images.length > 0)" 
                       class="product-placeholder">
                    {{ product.name.charAt(0) }}
                  </div>
                  @if (!product.inStock) {
                    <div class="out-of-stock-badge">Out of Stock</div>
                  }
                </a>
                <div class="p-b-24 p-t-12 p-x-30 position-relative">
                  <button 
                    mat-mini-fab 
                    matTooltip="Add to Cart" 
                    class="mdc-fab mat-mdc-fab-base mdc-fab--mini mat-mdc-mini-fab mat-mdc-button-base icon-30 cart-btn bg-primary text-white mat-accent"
                    (click)="addToCart(product, $event)"
                    [disabled]="!product.inStock">
                    <i-tabler name="basket" class="icon-16 d-block"></i-tabler>
                  </button>
                  <mat-card-title class="mat-mdc-card-title f-s-16 m-b-4">{{ product.name }}</mat-card-title>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <h6 class="f-s-16 f-w-600">\${{ product.price.toFixed(2) }}</h6>
                    </div>
                    <div class="m-l-auto d-flex gap-4">
                      <i-tabler name="star" class="fill-warning icon-18"></i-tabler>
                      <i-tabler name="star" class="fill-warning icon-18"></i-tabler>
                      <i-tabler name="star" class="fill-warning icon-18"></i-tabler>
                      <i-tabler name="star" class="fill-warning icon-18"></i-tabler>
                      <i-tabler name="star" class="fill-warning icon-18"></i-tabler>
                    </div>
                  </div>
                  <p class="product-brand m-t-8 m-b-0">{{ product.brand || '' }}</p>
                </div>
              </mat-card>
            }
          </div>
        </div>

        <!-- Merchant Story Section -->
        @if (tenant.story) {
          <div class="merchant-story">
            <h2>About {{ tenant.name }}</h2>
            <p>{{ tenant.story }}</p>
          </div>
        }
      }

      @if (!loading && !tenant) {
        <div class="error-message">
          <i-tabler name="store" class="icon-64"></i-tabler>
          <h2>Store Not Found</h2>
          <p>This store doesn't exist or has been removed.</p>
          <button mat-raised-button color="primary" (click)="goHome()">Browse All Stores</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .storefront-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 60px;
    }

    .merchant-header {
      position: relative;
      height: 350px;
      background-size: cover;
      background-position: center;
      background-color: var(--mat-sys-primary-container);
    }

    .merchant-header-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
      display: flex;
      align-items: flex-end;
      padding: 48px;
    }

    .merchant-info {
      display: flex;
      align-items: flex-end;
      gap: 24px;
      color: white;
    }

    .merchant-logo {
      width: 120px;
      height: 120px;
      border-radius: 20px;
      object-fit: cover;
      border: 4px solid white;
      background: white;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    .merchant-logo-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 20px;
      background: white;
      color: var(--mat-sys-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 56px;
      font-weight: 700;
      border: 4px solid white;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    .merchant-details {
      flex: 1;
    }

    .merchant-name {
      margin: 0 0 12px 0;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.25);
      backdrop-filter: blur(10px);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      border: 1px solid rgba(255,255,255,0.3);
    }

    .merchant-description {
      margin: 0 0 16px 0;
      font-size: 15px;
      opacity: 0.95;
      max-width: 600px;
      line-height: 1.5;
    }

    .merchant-contact {
      display: flex;
      gap: 20px;
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: white;
      text-decoration: none;
      font-size: 14px;
      opacity: 0.9;
      font-weight: 500;
      padding: 8px 16px;
      background: rgba(255,255,255,0.15);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
    }

    .contact-link:hover {
      opacity: 1;
      background: rgba(255,255,255,0.25);
    }

    .store-controls {
      display: flex;
      gap: 20px;
      padding: 24px 32px;
      background: white;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }

    .search-bar {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: var(--mat-sys-surface-container-low);
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,0.08);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .search-bar:focus-within {
      border-color: var(--mat-sys-primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .search-bar i-tabler {
      color: var(--mat-sys-on-surface-variant);
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 15px;
      outline: none;
      color: var(--mat-sys-on-surface);
    }

    .search-input::placeholder {
      color: var(--mat-sys-on-surface-variant);
    }

    .filter-bar {
      width: 220px;
    }

    .category-select {
      width: 100%;
    }

    .products-section {
      padding: 32px;
    }

    .section-title {
      margin: 0 0 24px 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .no-products {
      text-align: center;
      padding: 80px 20px;
    }

    .no-products i-tabler {
      color: var(--mat-sys-primary);
      opacity: 0.3;
      margin-bottom: 20px;
    }

    .no-products h3 {
      margin: 0 0 12px 0;
      font-size: 22px;
      font-weight: 600;
    }

    .no-products p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 15px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .productcard {
      border-radius: 16px;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0,0,0,0.06);
    }

    .productcard:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }

    .product-card-image {
      height: 240px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .productcard:hover .product-card-image {
      transform: scale(1.05);
    }

    .product-placeholder {
      width: 100%;
      height: 240px;
      background: linear-gradient(135deg, var(--mat-sys-primary-container), var(--mat-sys-secondary-container));
      color: var(--mat-sys-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
      font-weight: 700;
    }

    .out-of-stock-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      z-index: 2;
      backdrop-filter: blur(10px);
    }

    .cart-btn {
      position: absolute;
      top: -16px;
      right: 24px;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .cart-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
    }

    .cart-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .product-brand {
      margin: 0;
      font-size: 13px;
      color: var(--mat-sys-on-surface-variant);
      font-weight: 500;
    }

    .bg-primary {
      background: var(--mat-sys-primary) !important;
    }

    .text-white {
      color: white !important;
    }

    .text-decoration-line-through {
      text-decoration: line-through;
      color: var(--mat-sys-on-surface-variant);
    }

    .fill-warning {
      color: #f59e0b;
    }

    .icon-16 {
      width: 16px;
      height: 16px;
    }

    .icon-18 {
      width: 18px;
      height: 18px;
    }

    .icon-20 {
      width: 20px;
      height: 20px;
    }

    .icon-30 {
      width: 30px;
      height: 30px;
    }

    .icon-64 {
      width: 64px;
      height: 64px;
    }

    .f-s-14 {
      font-size: 14px;
    }

    .f-s-16 {
      font-size: 16px;
    }

    .f-w-500 {
      font-weight: 500;
    }

    .f-w-600 {
      font-weight: 600;
    }

    .m-b-4 {
      margin-bottom: 4px;
    }

    .m-t-8 {
      margin-top: 8px;
    }

    .m-l-4 {
      margin-left: 4px;
    }

    .p-b-24 {
      padding-bottom: 24px;
    }

    .p-t-12 {
      padding-top: 12px;
    }

    .p-x-30 {
      padding-left: 30px;
      padding-right: 30px;
    }

    .position-relative {
      position: relative;
    }

    .d-flex {
      display: flex;
    }

    .d-block {
      display: block;
    }

    .align-items-center {
      align-items: center;
    }

    .justify-content-between {
      justify-content: space-between;
    }

    .m-l-auto {
      margin-left: auto;
    }

    .gap-4 {
      gap: 4px;
    }

    .w-100 {
      width: 100%;
    }

    .overflow-hidden {
      overflow: hidden;
    }

    .merchant-story {
      padding: 32px;
      background: var(--mat-sys-surface-container-low);
      margin: 32px;
      border-radius: 20px;
      border: 1px solid rgba(0,0,0,0.06);
    }

    .merchant-story h2 {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .merchant-story p {
      margin: 0;
      line-height: 1.7;
      color: var(--mat-sys-on-surface-variant);
      font-size: 15px;
    }

    .error-message {
      text-align: center;
      padding: 80px 20px;
    }

    .error-message i-tabler {
      color: var(--mat-sys-error);
      margin-bottom: 20px;
    }

    .error-message h2 {
      margin: 0 0 12px 0;
      font-size: 28px;
      font-weight: 700;
    }

    .error-message p {
      margin: 0 0 32px 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 15px;
    }

    @media (max-width: 768px) {
      .merchant-header {
        height: 280px;
      }

      .merchant-header-overlay {
        padding: 24px;
      }

      .merchant-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .merchant-logo,
      .merchant-logo-placeholder {
        width: 80px;
        height: 80px;
        font-size: 36px;
      }

      .merchant-name {
        font-size: 28px;
      }

      .store-controls {
        flex-direction: column;
        padding: 20px;
        gap: 16px;
      }

      .filter-bar {
        width: 100%;
      }

      .products-section {
        padding: 20px;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
      }

      .product-card-image {
        height: 180px;
      }

      .merchant-story {
        margin: 20px;
        padding: 24px;
      }

      .section-title {
        font-size: 24px;
      }
    }

    @media (max-width: 576px) {
      .merchant-header {
        height: 240px;
      }

      .merchant-header-overlay {
        padding: 20px;
      }

      .merchant-logo,
      .merchant-logo-placeholder {
        width: 60px;
        height: 60px;
        font-size: 28px;
      }

      .merchant-name {
        font-size: 24px;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
      }

      .product-card-image {
        height: 160px;
      }

      .p-x-30 {
        padding-left: 20px;
        padding-right: 20px;
      }

      .cart-btn {
        right: 16px;
      }
    }
  `]
})
export class StorefrontComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private tenantService = inject(TenantService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  tenant: Tenant | null = null;
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory: string | null = null;

  ngOnInit(): void {
    const domain = this.route.snapshot.paramMap.get('domain');
    if (domain) {
      this.loadStorefront(domain);
    } else {
      this.loading = false;
    }
  }

  loadStorefront(domain: string): void {
    this.loading = true;

    // Load tenant by domain
    this.tenantService.getByDomain(domain).subscribe({
      next: (tenant) => {
        this.tenant = tenant;
        
        // Load products for this tenant
        this.productService.getProducts().subscribe({
          next: (products) => {
            this.products = products.filter(p => p.tenantId === tenant.id);
            this.filteredProducts = [...this.products];
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });

        // Load categories
        this.categoryService.getCategories(tenant.id).subscribe({
          next: (categories) => {
            this.categories = categories;
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesCategory = !this.selectedCategory || product.categoryId === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    
    if (!this.tenant) return;

    try {
      this.cartService.setTenantInfo(
        this.tenant.id,
        this.tenant.name,
        this.tenant.logo
      );

      this.cartService.addToCart({
        tenantId: this.tenant.id,
        productId: product.id!,
        productName: product.name,
        productImage: product.imageUrl || (product.images && product.images.length > 0 ? product.images[0] : undefined),
        brand: product.brand,
        unitPrice: product.price,
        quantity: 1,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity
      });

      this.snackBar.open('Added to cart', 'Close', { duration: 2000 });
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to add to cart', 'Close', { duration: 2000 });
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
