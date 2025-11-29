import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthGuard } from './theme/shared/gaurds/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      { path: 'user', loadChildren: () => import('./demo/user-management/user/user.module').then(m => m.UserManagementModule) },
      { path: 'category', loadChildren: () => import('./demo/category-management/category/category.module').then(m => m.CategoryModule) },
      { path: 'product', loadChildren: () => import('./demo/product-management/product/product.module').then(m => m.ProductModule) },
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/register/register.component')
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
