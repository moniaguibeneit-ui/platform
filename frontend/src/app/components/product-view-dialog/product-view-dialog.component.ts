import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="view-dialog">
      <!-- Image gallery -->
      <div class="gallery" *ngIf="allImages.length > 0; else noImage">
        <div class="main-image">
          <img [src]="allImages[selectedImage]" alt="product" />
        </div>
        <div class="thumbnails" *ngIf="allImages.length > 1">
          <div *for="let img of allImages; let i = index"
               class="thumb" [class.active]="i === selectedImage"
               (click)="selectedImage = i">
            <img [src]="img" alt="thumbnail {{ i + 1 }}" />
          </div>
        </div>
      </div>
      <ng-template #noImage>
        <div class="view-image-placeholder">
          <mat-icon>shopping_bag</mat-icon>
        </div>
      </ng-template>

      <div class="view-content">
        <!-- Title -->
        <div class="view-header">
          <h2>{{ product.name }}</h2>
          <span class="brand">{{ product.brand }}</span>
        </div>

        <!-- Price + Status -->
        <div class="view-meta">
          <div class="price-tag">\${{ product.price }}</div>
          <span class="status-badge" [class.in-stock]="product.inStock" [class.out-stock]="!product.inStock">
            <mat-icon>{{ product.inStock ? 'check_circle' : 'cancel' }}</mat-icon>
            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
          </span>
        </div>

        <mat-divider></mat-divider>

        <!-- Details grid -->
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-icon"><mat-icon>category</mat-icon></div>
            <div>
              <div class="detail-label">Category</div>
              <div class="detail-value">{{ product.category || 'N/A' }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><mat-icon>water_drop</mat-icon></div>
            <div>
              <div class="detail-label">Volume</div>
              <div class="detail-value">{{ product.volume || 'N/A' }}</div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-icon"><mat-icon>spa</mat-icon></div>
            <div>
              <div class="detail-label">Fragrance Notes</div>
              <div class="detail-value">{{ product.fragranceNotes || 'N/A' }}</div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="description-section" *ngIf="product.description">
          <div class="detail-label">Description</div>
          <p>{{ product.description }}</p>
        </div>
      </div>

      <mat-dialog-actions align="end">
        <button mat-flat-button color="primary" (click)="close()">
          <mat-icon>close</mat-icon> Close
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .view-dialog {
      overflow: hidden;
      border-radius: 16px;
    }

    .gallery {
      .main-image {
        width: 100%;
        height: 240px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .thumbnails {
        display: flex;
        gap: 8px;
        padding: 12px;
        overflow-x: auto;

        .thumb {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          flex-shrink: 0;
          transition: border-color 0.2s;

          &.active {
            border-color: #6366f1;
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }

    .view-image-placeholder {
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: white;
        opacity: 0.9;
      }
    }

    .view-content {
      padding: 24px;
    }

    .view-header {
      margin-bottom: 16px;

      h2 {
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 4px;
      }

      .brand {
        font-size: 14px;
        color: #64748b;
        font-weight: 500;
      }
    }

    .view-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;

      .price-tag {
        font-size: 28px;
        font-weight: 700;
        color: #6366f1;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        &.in-stock {
          background: rgba(34,197,94,0.1);
          color: #16a34a;
        }
        &.out-stock {
          background: rgba(239,68,68,0.1);
          color: #dc2626;
        }
      }
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 20px 0;

      .detail-item {
        display: flex;
        align-items: center;
        gap: 12px;

        .detail-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            color: #6366f1;
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        .detail-label {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
        }
      }
    }

    .description-section {
      margin-top: 16px;

      .detail-label {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 500;
        margin-bottom: 6px;
      }

      p {
        font-size: 14px;
        color: #334155;
        line-height: 1.6;
        margin: 0;
      }
    }

    mat-dialog-actions {
      padding: 0 24px 24px;
    }
  `],
})
export class ProductViewDialogComponent {
  selectedImage = 0;
  allImages: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<ProductViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) {
    // Combine images list + imageUrl for backward compat
    if (product.images && product.images.length > 0) {
      this.allImages = [...product.images];
    } else if (product.imageUrl) {
      this.allImages = [product.imageUrl];
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
