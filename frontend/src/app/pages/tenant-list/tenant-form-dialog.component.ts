import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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
  ],
  template: `
    <h2 mat-dialog-title>New Tenant</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" placeholder="Acme Corp" required>
        <mat-error *ngIf="form.controls.name.hasError('required')">Name is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Domain</mat-label>
        <input matInput formControlName="domain" placeholder="acme" required>
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
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="submit()" [disabled]="form.invalid">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 12px; }
    mat-dialog-content { min-width: 400px; padding-top: 8px; }
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
