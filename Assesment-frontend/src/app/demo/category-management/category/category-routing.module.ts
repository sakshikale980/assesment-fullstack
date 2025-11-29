import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from '../category-list/category-list.component';
import { AddCategoryComponent } from '../add-category/add-category.component';

const routes: Routes = [
    { path: '', component: CategoryListComponent },
    { path: 'add', component: AddCategoryComponent },
    { path: 'edit', component: AddCategoryComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
