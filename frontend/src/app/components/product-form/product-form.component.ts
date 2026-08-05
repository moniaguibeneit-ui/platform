import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatProgressBarModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  form: FormGroup;
  isEdit: boolean;
  imageUrls: string[] = [];
  uploading = false;
  document = document;

  private http = inject(HttpClient);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', product?: Product }
  ) {
    this.isEdit = data.mode === 'edit';
    const product = data.product || {} as Product;
    this.form = this.fb.group({
      id: [product.id],
      name: [product.name || '', Validators.required],
      brand: [product.brand || '', Validators.required],
      description: [product.description || '', Validators.required],
      price: [product.price || 0, [Validators.required, Validators.min(0)]],
      category: [product.category || 'Perfume'],
      volume: [product.volume || '', Validators.required],
      fragranceNotes: [product.fragranceNotes || ''],
      inStock: [product.inStock ?? true],
    });
    // Load existing images
    if (product.images && product.images.length > 0) {
      this.imageUrls = [...product.images];
    } else if (product.imageUrl) {
      this.imageUrls = [product.imageUrl];
    }
  }

  get primaryImage(): string | null {
    return this.imageUrls.length > 0 ? this.imageUrls[0] : null;
  }

  onFilesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    this.uploading = true;
    let remaining = files.length;
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<{ url: string }>(`${environment.apiUrl}/products/upload`, formData).subscribe({
        next: (res) => {
          newUrls.push(res.url);
          remaining--;
          if (remaining === 0) {
            this.imageUrls.push(...newUrls);
            this.uploading = false;
          }
        },
        error: () => {
          remaining--;
          if (remaining === 0) {
            this.uploading = false;
          }
        },
      });
    }
    // Clear input so same file can be selected again
    (event.target as HTMLInputElement).value = '';
  }

  removeImage(index: number): void {
    this.imageUrls.splice(index, 1);
  }

  moveImage(index: number, direction: 'left' | 'right'): void {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= this.imageUrls.length) return;
    [this.imageUrls[index], this.imageUrls[newIndex]] = [this.imageUrls[newIndex], this.imageUrls[index]];
  }

  onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.value;
      value.imageUrl = this.imageUrls.length > 0 ? this.imageUrls[0] : null;
      value.imageUrls = this.imageUrls;
      this.dialogRef.close(value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
