import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TenantService } from '../../services/tenant.service';
import { Tenant } from '../../models/tenant';
import { TenantFormDialogComponent } from './tenant-form-dialog.component';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './tenant-list.component.html',
  styleUrl: './tenant-list.component.scss',
})
export class TenantListComponent implements OnInit {
  private tenantService = inject(TenantService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  tenants: Tenant[] = [];
  displayedColumns = ['name', 'plan', 'status', 'active', 'createdAt', 'actions'];
  loading = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.tenantService.list().subscribe({
      next: (data) => {
        this.tenants = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load tenants', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(TenantFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.tenantService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Tenant created', 'Close', { duration: 3000 });
            this.load();
          },
          error: (e) => this.snackBar.open(e.error?.error || 'Create failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  activate(t: Tenant): void {
    this.tenantService.activate(t.id).subscribe({
      next: () => { this.snackBar.open('Tenant activated', 'Close', { duration: 3000 }); this.load(); },
      error: () => this.snackBar.open('Failed', 'Close', { duration: 3000 }),
    });
  }

  suspend(t: Tenant): void {
    this.tenantService.suspend(t.id).subscribe({
      next: () => { this.snackBar.open('Tenant suspended', 'Close', { duration: 3000 }); this.load(); },
      error: () => this.snackBar.open('Failed', 'Close', { duration: 3000 }),
    });
  }

  terminate(t: Tenant): void {
    if (confirm(`Terminate tenant "${t.name}"? This cannot be undone easily.`)) {
      this.tenantService.terminate(t.id).subscribe({
        next: () => { this.snackBar.open('Tenant terminated', 'Close', { duration: 3000 }); this.load(); },
        error: () => this.snackBar.open('Failed', 'Close', { duration: 3000 }),
      });
    }
  }

  planChipClass(plan: string): string {
    switch (plan) {
      case 'ENTERPRISE': return 'bg-light-primary text-primary';
      case 'PRO': return 'bg-light-success text-success';
      default: return 'bg-light-secondary text-secondary';
    }
  }

  statusChipClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-light-success text-success';
      case 'SUSPENDED': return 'bg-light-warning text-warning';
      default: return 'bg-light-error text-error';
    }
  }
}
