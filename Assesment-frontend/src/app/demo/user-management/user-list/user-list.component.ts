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
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule, DataTableComponent,],
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
    this.userService.getUserList(this.pageSize, this.pageNumber,).subscribe({
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
        }
      }, 3000);
    }, 0);
  }
  
}

