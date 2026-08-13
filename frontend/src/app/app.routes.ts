import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { TenantListComponent } from './pages/tenant-list/tenant-list.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { authGuard } from './guards/auth.guard';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { OrderTrackingComponent } from './pages/order-tracking/order-tracking.component';
import { StorefrontComponent } from './pages/storefront/storefront.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
      },
      {
        path: 'store/:domain',
        component: StorefrontComponent,
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent,
      },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      // Public customer routes
      {
        path: 'checkout',
        component: CheckoutComponent,
      },
      {
        path: 'order-confirmation/:orderNumber',
        component: OrderConfirmationComponent,
      },
      {
        path: 'order-tracking/:orderNumber',
        component: OrderTrackingComponent,
      },
      {
        path: 'order-tracking',
        component: OrderTrackingComponent,
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'tenants',
        component: TenantListComponent,
      },
      {
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'categories',
        component: CategoryListComponent,
      },
      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];