import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { UserFormDialogComponent } from './user-form-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  users: User[] = [];
  displayedColumns = ['user', 'roles', 'active', 'createdAt', 'actions'];
  loading = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.userService.list().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.snackBar.open('Failed to load users', 'Close', { duration: 3000 }); this.loading = false; },
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '560px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.create(result).subscribe({
          next: () => { this.snackBar.open('User created', 'Close', { duration: 3000 }); this.load(); },
          error: (e) => this.snackBar.open(e.error?.error || 'Create failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  openEdit(user: User): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '560px',
      data: { mode: 'edit', user: { ...user } },
    });
    ref.afterClosed().subscribe((result) => {
      if (result && user.id) {
        this.userService.update(user.id, result).subscribe({
          next: () => { this.snackBar.open('User updated', 'Close', { duration: 3000 }); this.load(); },
          error: (e) => this.snackBar.open(e.error?.error || 'Update failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  deleteUser(u: User): void {
    if (confirm(`Delete user "${u.email}"?`)) {
      if (u.id) {
        this.userService.delete(u.id).subscribe({
          next: () => { this.snackBar.open('User deleted', 'Close', { duration: 3000 }); this.load(); },
          error: () => this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 }),
        });
      }
    }
  }
}
