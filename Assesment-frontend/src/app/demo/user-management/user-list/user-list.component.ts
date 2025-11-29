import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableComponent } from 'src/app/theme/shared/data-table/data-table/data-table.component';
import { app_userBulkGridConfig, app_userTableConfig } from '../model/user.grid.config.model';
import { user } from '../model/model';
import { DeleteComponent } from 'src/app/theme/shared/delete/delete/delete.component';
import { SearchComponent } from 'src/app/theme/shared/components/search/search.component';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule, DataTableComponent, DeleteComponent,SearchComponent ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [UserService]
})
export class UserListComponent implements OnInit, AfterViewInit {
  userList: any[] = [];
  users: any;
  searchTerm: string = '';
  isLoading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  totalPages: any;
  count: number = 0;
  errorMessage: string = '';
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  notificationMessage: any;
  @ViewChild('alertContainer') alertcontainer!: ElementRef

  tableConfig = app_userTableConfig;
  paginationConfig = app_userBulkGridConfig;

  config = {
    searchTerm: this.searchTerm || "",
    pageNumber: this.pageNumber || 1,
    pageSize: this.pageSize || 10
  }

  constructor(
    private userService: UserService,
    private route: Router,
    private modalService: NgbModal
  ) { }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(): void {
    this.isLoading = true;

    if (isNaN(this.pageNumber) || this.pageNumber <= 0) {
      this.pageNumber = 1;
    }

    this.userService.getUserList(this.pageSize, this.pageNumber, this.searchTerm).subscribe({
      next: (res: any) => {
        this.count = res.count;
        const data = res.rows.map((item: any) => {
          return {
            ...item,
            roleName: item?.role?.name
          };
        });
        this.userList = data;
      },
      error: (err) => {
        console.error('Error fetching user list', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  searchUser(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.config.searchTerm = this.searchTerm;
    this.pageNumber = 1;
    this.config.pageNumber = this.pageNumber;
    this.getUserList();
  }

  closeAlert() {
    this.showSuccessAlert = false;
    this.notificationMessage = '';
  }

  navigateToAddUser() {
    this.route.navigate(['/user/add']);
  }

  navigateToViewUser(event: any) {
    this.route.navigate(['user/view'], { queryParams: { id: event.id } });
  }

  navigateToEditUser(event: any) {
    this.route.navigate(['user/edit'], { queryParams: { id: event.id } });
  }

  goToPage(page: number) {
    this.pageNumber = page;
    this.config.pageNumber = this.pageNumber;
    this.getUserList();
  }

  changedPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.config.pageSize = this.pageSize;
    this.getUserList();
  }

  confirmDelete(user: user) {
    const modalRef = this.modalService.open(DeleteComponent);
    modalRef.componentInstance.message = 'Are you sure you want to delete this User?';

    modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
      if (result) {
        this.deleteUser(user);
      }
    });
  }

  deleteUser(user: user) {
    const payload = { id: user.id, deleted: true };
    this.userService.deleteUserSer(payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.showNotification({ success: true, message: 'User deleted successfully!' });
          this.getUserList();
        } else {
          this.showNotification({ success: false, message: res.message || 'Failed to delete user.' });
        }
      },
      error: (err) => {
        this.showNotification({ success: false, message: err.error?.message || 'Error deleting user.' });
      },
      complete: () => {
        this.modalService.dismissAll();
      }
    });
  }

  showNotification(res: any) {
    this.showSuccessAlert = true;
    setTimeout(() => {
      const alertContainer = this.alertcontainer.nativeElement;
      alertContainer.classList.remove('alert-success');
      alertContainer.classList.remove('alert-danger');

      if (res?.success === false) {
        this.notificationMessage = res.message || "An error occurred.";
        alertContainer.classList.add('alert-danger');
      } else if (res?.success === true) {
        this.notificationMessage = res.message
        alertContainer.classList.add('alert-success');
      } else {
        this.notificationMessage = "User deleted successfully!";
        alertContainer.classList.add('alert-success');
      }

      setTimeout(() => {
        this.showSuccessAlert = false;
        alertContainer.classList.remove('alert-success');
        alertContainer.classList.remove('alert-danger');
        if (res?.id > 0 || res?.success == true) {
          // this.navigateToBackUsers();
        }
      }, 3000);
    }, 0);
  }
}

