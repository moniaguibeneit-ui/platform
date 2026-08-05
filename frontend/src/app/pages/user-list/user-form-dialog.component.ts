import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { RoleService } from '../../services/role.service';
import { User, Role } from '../../models/user';

@Component({
  selector: 'app-user-form-dialog',
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
    MatChipsModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
})
export class UserFormDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<UserFormDialogComponent>);
  private roleService = inject(RoleService);
  data = inject(MAT_DIALOG_DATA) as { mode: 'create' | 'edit'; user?: User };

  isEdit = this.data.mode === 'edit';
  roles: Role[] = [];

  form = this.fb.group({
    email: [this.data.user?.email || '', [Validators.required, Validators.email]],
    password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
    firstName: [this.data.user?.firstName || ''],
    lastName: [this.data.user?.lastName || ''],
    active: [this.data.user?.active ?? true],
    roleIds: [this.data.user?.roles?.map(r => r.id) || []],
  });

  ngOnInit(): void {
    this.roleService.list().subscribe({
      next: (roles) => { this.roles = roles; },
      error: () => {},
    });
  }

  cancel(): void {
    this.ref.close();
  }

  submit(): void {
    if (this.form.valid) {
      const value = this.form.value;
      // Don't send password on edit if empty
      if (this.isEdit && !value.password) {
        delete (value as any).password;
      }
      this.ref.close(value);
    }
  }
}
