import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '../../models/category';

interface DialogData {
  mode: 'create' | 'edit';
  category?: Category;
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="dialog-header">
      <div class="dialog-icon">
        <mat-icon>{{ mode === 'edit' ? 'edit' : 'category' }}</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ mode === 'edit' ? 'Edit Category' : 'New Category' }}</h2>
    </div>

    <mat-dialog-content>
      <form [formGroup]="form" class="category-form">
        <!-- Name -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category Name *</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Perfumes" required>
          <mat-icon matSuffix>category</mat-icon>
          <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>

        <!-- Description -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="2" placeholder="Brief category description"></textarea>
        </mat-form-field>

        <!-- Slug -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Slug</mat-label>
          <input matInput formControlName="slug" placeholder="e.g. perfumes">
          <mat-icon matSuffix>link</mat-icon>
          <mat-hint>URL-friendly identifier (optional)</mat-hint>
        </mat-form-field>

        <!-- Icon -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Icon</mat-label>
          <input matInput formControlName="icon" placeholder="e.g. 🌸">
          <mat-icon matSuffix>emoji_emotions</mat-icon>
          <mat-hint>Emoji or icon (optional)</mat-hint>
        </mat-form-field>

        <!-- Order -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Display Order</mat-label>
          <input matInput type="number" formControlName="order" placeholder="0">
          <mat-icon matSuffix>sort</mat-icon>
          <mat-hint>Lower numbers appear first</mat-hint>
        </mat-form-field>

        <!-- Active -->
        <div class="form-row">
          <mat-checkbox formControlName="active" color="primary">
            <span class="d-flex align-items-center gap-8">
              <mat-icon [class.text-success]="form.get('active')?.value" [class.text-error]="!form.get('active')?.value" style="font-size:18px;width:18px;height:18px;">
                {{ form.get('active')?.value ? 'check_circle' : 'cancel' }}
              </mat-icon>
              {{ form.get('active')?.value ? 'Active' : 'Inactive' }}
            </span>
          </mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-stroked-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="!form.valid">
        <mat-icon style="font-size:20px;width:20px;height:20px;">{{ mode === 'edit' ? 'save' : 'add' }}</mat-icon>
        {{ mode === 'edit' ? 'Save Changes' : 'Create Category' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .dialog-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #6366f1, #818cf8);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          color: white;
          font-size: 22px;
          width: 22px;
          height: 22px;
        }
      }

      h2 {
        margin: 0;
        font-size: 19px;
        font-weight: 700;
      }
    }

    .category-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 8px;
    }

    .full-width { width: 100%; }
    .form-row { margin-top: 8px; }
    .gap-8 { gap: 8px; }
    .text-success { color: #22c55e; }
    .text-error { color: #ef4444; }
    .d-flex { display: flex; }
    .align-items-center { align-items: center; }

    .dialog-actions {
      padding-top: 16px;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .dialog-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      h2 {
        font-size: 16px !important;
      }
    }
  `]
})
export class CategoryFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryFormDialogComponent>);
  private data = inject<DialogData>(MAT_DIALOG_DATA);
  
  mode = this.data.mode;
  category = this.data.category;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    slug: [''],
    icon: [''],
    order: [0],
    active: [true]
  });

  ngOnInit(): void {
    if (this.mode === 'edit' && this.category) {
      this.form.patchValue({
        name: this.category.name,
        description: this.category.description || '',
        slug: this.category.slug || '',
        icon: this.category.icon || '',
        order: this.category.order || 0,
        active: this.category.active
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      if (this.mode === 'create') {
        const request: CategoryCreateRequest = {
          name: formValue.name,
          description: formValue.description,
          slug: formValue.slug,
          icon: formValue.icon,
          order: formValue.order,
          active: formValue.active
        };
        this.dialogRef.close(request);
      } else {
        const request: CategoryUpdateRequest = {
          name: formValue.name,
          description: formValue.description,
          slug: formValue.slug,
          icon: formValue.icon,
          order: formValue.order,
          active: formValue.active
        };
        this.dialogRef.close(request);
      }
    }
  }
}
