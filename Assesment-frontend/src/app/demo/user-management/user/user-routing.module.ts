import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { ViewUserComponent } from '../view-user/view-user.component';


const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'add', component: AddUserComponent },
  { path: 'edit', component: AddUserComponent },
  { path: 'view', component: ViewUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
