import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { CategoryFormDialogComponent } from './category-form-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
  ],
  template: `
    <div class="category-list-container">
      <mat-card class="cardWithShadow">
        <mat-card-header>
          <div>
            <mat-card-title>Product Categories</mat-card-title>
            <p class="f-s-13 text-muted m-t-4 m-b-0">Manage your product categories</p>
          </div>
          <div class="header-actions">
            <button mat-flat-button color="primary" (click)="openAddDialog()">
              <mat-icon>add</mat-icon>
              New Category
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <!-- Loading -->
          <div *ngIf="loading" class="text-center p-y-40">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <!-- Empty state -->
          <div *ngIf="!loading && categories.length === 0" class="text-center p-y-40">
            <div class="empty-icon-wrap bg-light-primary text-primary m-auto">
              <mat-icon>category</mat-icon>
            </div>
            <h4 class="f-w-600 m-t-16 m-b-8">No categories yet</h4>
            <p class="text-muted m-b-24">Create categories to organize your products</p>
            <button mat-flat-button color="primary" (click)="openAddDialog()">
              <mat-icon>add</mat-icon>
              New Category
            </button>
          </div>

          <!-- Table -->
          <table *ngIf="!loading && categories.length > 0" mat-table [dataSource]="categories" class="w-100">
            <!-- Category Name -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef class="f-w-600 f-s-16">Category Name</th>
              <td mat-cell *matCellDef="let category">
                <div class="d-flex align-items-center">
                  <div *ngIf="category.icon" class="category-icon">{{ category.icon }}</div>
                  <div class="m-l-16">
                    <h6 class="text-truncate-2 f-s-14 f-w-600 m-0">{{ category.name }}</h6>
                    <span class="f-s-13 text-muted">{{ category.description || 'No description' }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Slug -->
            <ng-container matColumnDef="slug">
              <th mat-header-cell *matHeaderCellDef class="f-w-600 f-s-16">Slug</th>
              <td mat-cell *matCellDef="let category">
                <span class="f-s-13 text-muted">{{ category.slug || '-' }}</span>
              </td>
            </ng-container>

            <!-- Order -->
            <ng-container matColumnDef="order">
              <th mat-header-cell *matHeaderCellDef class="f-w-600 f-s-16">Order</th>
              <td mat-cell *matCellDef="let category">
                <span class="f-w-600 f-s-14">{{ category.order || 0 }}</span>
              </td>
            </ng-container>

            <!-- Status -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="f-w-600 f-s-16">Status</th>
              <td mat-cell *matCellDef="let category">
                <span [class]="category.active ? 'bg-light-success text-success' : 'bg-light-error text-error'" class="rounded f-w-600 p-6 p-y-4 f-s-12">
                  {{ category.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </ng-container>

            <!-- Actions -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="f-w-600 f-s-16">Actions</th>
              <td mat-cell *matCellDef="let category">
                <button mat-icon-button color="primary" (click)="openEditDialog(category)" matTooltip="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button [color]="category.active ? 'warn' : 'primary'" (click)="toggleStatus(category)" [matTooltip]="category.active ? 'Deactivate' : 'Activate'">
                  <mat-icon>{{ category.active ? 'block' : 'check_circle' }}</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteCategory(category.id!)" matTooltip="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .category-list-container {
      padding: 16px;
    }

    .header-actions {
      margin-left: auto;
    }

    .empty-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }

    .category-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .text-truncate-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .p-y-40 { padding-top: 40px; padding-bottom: 40px; }
    .m-auto { margin: 0 auto; }
    .m-t-4 { margin-top: 4px; }
    .m-t-16 { margin-top: 16px; }
    .m-b-8 { margin-bottom: 8px; }
    .m-b-24 { margin-bottom: 24px; }
    .m-l-16 { margin-left: 16px; }
    .text-muted { color: var(--mat-sys-on-surface-variant); }
    .f-s-12 { font-size: 12px; }
    .f-s-13 { font-size: 13px; }
    .f-s-14 { font-size: 14px; }
    .f-s-16 { font-size: 16px; }
    .f-w-600 { font-weight: 600; }
    .text-center { text-align: center; }
    .d-flex { display: flex; }
    .align-items-center { align-items: center; }
    .rounded { border-radius: 4px; }
    .p-6 { padding: 6px; }
    .p-y-4 { padding-top: 4px; padding-bottom: 4px; }
    .w-100 { width: 100%; }

    @media (max-width: 768px) {
      .category-list-container {
        padding: 8px;
      }

      mat-card-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 12px;
      }

      .header-actions {
        margin-left: 0;
        width: 100%;
      }

      .header-actions button {
        width: 100%;
      }

      table {
        min-width: 600px;
      }

      mat-card-content {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
    }

    @media (max-width: 576px) {
      .category-list-container {
        padding: 4px;
      }

      mat-card-title {
        font-size: 18px !important;
      }

      .text-muted {
        font-size: 12px !important;
      }
    }
  `]
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  categories: Category[] = [];
  displayedColumns = ['name', 'slug', 'order', 'status', 'actions'];
  loading = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    const ref = this.dialog.open(CategoryFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.addCategory(result).subscribe({
          next: () => {
            this.snackBar.open('Category created', 'Close', { duration: 3000 });
            this.loadCategories();
          },
          error: (e) => this.snackBar.open(e.error?.error || 'Create failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  openEditDialog(category: Category): void {
    const ref = this.dialog.open(CategoryFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', category },
    });
    ref.afterClosed().subscribe((result) => {
      if (result && category.id) {
        this.categoryService.updateCategory(category.id, result).subscribe({
          next: () => {
            this.snackBar.open('Category updated', 'Close', { duration: 3000 });
            this.loadCategories();
          },
          error: (e) => this.snackBar.open(e.error?.error || 'Update failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  toggleStatus(category: Category): void {
    if (!category.id) return;
    
    const updatedCategory = { ...category, active: !category.active };
    this.categoryService.updateCategory(category.id, updatedCategory).subscribe({
      next: () => {
        this.snackBar.open(`Category ${updatedCategory.active ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 });
        this.loadCategories();
      },
      error: () => this.snackBar.open('Failed to update status', 'Close', { duration: 3000 }),
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.snackBar.open('Category deleted', 'Close', { duration: 3000 });
          this.loadCategories();
        },
        error: () => this.snackBar.open('Failed to delete category', 'Close', { duration: 3000 }),
      });
    }
  }
}
