import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { AppProfitExpensesComponent } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTrafficDistributionComponent } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { AppProductSalesComponent } from 'src/app/components/product-sales/product-sales.component';
import { AppUpcomingSchedulesComponent } from 'src/app/components/upcoming-schedules/upcoming-schedules.component';
import { AppTopEmployeesComponent } from 'src/app/components/top-employees/top-employees.component';
import { AppBlogComponent } from 'src/app/components/apps-blog/apps-blog.component';
import { ProductService } from 'src/app/services/product.service';
import { TenantService } from 'src/app/services/tenant.service';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/models/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-starter',
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    AppProfitExpensesComponent,
    AppTrafficDistributionComponent,
    AppProductSalesComponent,
    AppUpcomingSchedulesComponent,
    AppTopEmployeesComponent,
    AppBlogComponent
  ],
  templateUrl: './starter.component.html',
  styleUrl: './starter.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit {
  private productService = inject(ProductService);
  private tenantService = inject(TenantService);
  private auth = inject(AuthService);

  productCount = 0;
  tenantCount = 0;
  activeProducts = 0;
  loading = true;
  userEmail: string | null = null;
  recentProducts: Product[] = [];

  ngOnInit(): void {
    this.userEmail = this.auth.email();
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.productCount = products.length;
        this.activeProducts = products.filter(p => p.inStock).length;
        this.recentProducts = products.slice(0, 5);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.tenantService.list().subscribe({
      next: (tenants) => { this.tenantCount = tenants.length; }
    });
  }
}
