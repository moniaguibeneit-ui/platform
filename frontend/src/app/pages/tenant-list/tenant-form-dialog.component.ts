import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  mode: 'create';
}

@Component({
  selector: 'app-tenant-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="dialog-header">
      <div class="dialog-icon">
        <mat-icon>domain_add</mat-icon>
      </div>
      <h2 mat-dialog-title>New Tenant</h2>
    </div>

    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Tenant Name</mat-label>
        <input matInput formControlName="name" placeholder="Acme Corp" required>
        <mat-icon matSuffix>apartment</mat-icon>
        <mat-error *ngIf="form.controls.name.hasError('required')">Name is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Domain</mat-label>
        <input matInput formControlName="domain" placeholder="acme" required>
        <mat-icon matSuffix>dns</mat-icon>
        <mat-error *ngIf="form.controls.domain.hasError('required')">Domain is required</mat-error>
        <mat-hint>Used as subdomain identifier</mat-hint>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Subscription Plan</mat-label>
        <mat-select formControlName="subscriptionPlan">
          <mat-option value="STARTER">STARTER</mat-option>
          <mat-option value="PRO">PRO</mat-option>
          <mat-option value="ENTERPRISE">ENTERPRISE</mat-option>
        </mat-select>
        <mat-icon matSuffix>workspace_premium</mat-icon>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-stroked-button (click)="cancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="form.invalid">
        <mat-icon style="font-size:20px;width:20px;height:20px;">add</mat-icon>
        Create Tenant
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
        background: linear-gradient(135deg, #f59e0b, #fbbf24);
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

    .full-width { width: 100%; margin-bottom: 8px; }
    mat-dialog-content { min-width: 420px; padding-top: 8px; }
    .dialog-actions { padding-top: 16px; gap: 10px; }
  `],
})
export class TenantFormDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<TenantFormDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as DialogData;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    domain: ['', [Validators.required, Validators.maxLength(100)]],
    subscriptionPlan: ['STARTER'],
  });

  cancel(): void {
    this.ref.close();
  }

  submit(): void {
    if (this.form.valid) {
      this.ref.close(this.form.value);
    }
  }
}
