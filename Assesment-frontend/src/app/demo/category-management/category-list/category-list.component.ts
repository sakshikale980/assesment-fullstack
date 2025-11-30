import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableComponent } from 'src/app/theme/shared/data-table/data-table/data-table.component';
import { CategoryService } from '../service/category.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { app_categoryBulkGridConfig, app_categoryTableConfig } from '../model/category.grid.config.model';
import { DeleteComponent } from 'src/app/theme/shared/delete/delete/delete.component';
import { Category } from '../model/model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule, DataTableComponent,],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  categoryList: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  count: number = 0;
  showSuccessAlert: boolean = false;
  notificationMessage: string = '';
  @ViewChild('alertContainer') alertcontainer!: ElementRef;

  tableConfig = app_categoryTableConfig;
  paginationConfig = app_categoryBulkGridConfig;
  config = {
    pageNumber: this.pageNumber || 1,
    pageSize: this.pageSize || 10
  };
  
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getCategoryList();
  }

  getCategoryList() {
    this.isLoading = true;

    this.categoryService.getCategoryList(this.pageSize, this.pageNumber,).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.count = res.length;
          this.categoryList = res.map((item: any) => ({ ...item, action: '' }));
        } else {
          this.count = res.count;
          this.categoryList = res.rows.map((item: any) => ({ ...item, action: '' }));
        }
        this.totalPages = Math.ceil(this.count / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.error("Error loading categories", err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  searchCategory(searchTerm: string) {
    this.pageNumber = 1;
    this.config.pageNumber = 1;
    this.getCategoryList();
  }

  goToPage(page: number) {
    this.pageNumber = page;
    this.config.pageNumber = page;
    this.getCategoryList();
  }

  changedPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.getCategoryList();
  }

  confirmDelete(category: Category) {
    const modalRef = this.modalService.open(DeleteComponent);
    modalRef.componentInstance.message = 'Are you sure you want to delete this Category?';

    modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
      if (result) {
        this.deleteCategory(category.id);
      }
    });
  }

  deleteCategory(id: string) {
    const payload = {
      deleted: true
    };

    this.categoryService.deleteCategoryService(id, payload).subscribe({
      next: (res) => {
        this.showNotification({ success: true, message: "Category deleted successfully!" });
        this.getCategoryList();
      },
      error: (err) => {
        this.showNotification({ success: false, message: err.error.message });
      },
      complete: () => {
        this.modalService.dismissAll();
      }
    });
  }

  cancelDelete() {
    this.modalService.dismissAll();
  }
  
  open(content, userId) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      if (result === 'yes') {
        this.deleteCategory(userId);
      }
    },
    );
  }

  navigateToAddCategory() {
    this.router.navigate(['/category/add']);
  }

  navigateToEditCategory(event: any) {
    this.router.navigate(['category/edit'], { queryParams: { id: event.id } });
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
      } else {
        this.notificationMessage = res.message || "Category deleted successfully!";
        alertContainer.classList.add('alert-success');
      }

      setTimeout(() => {
        this.showSuccessAlert = false;
        alertContainer.classList.remove('alert-success');
        alertContainer.classList.remove('alert-danger');
      }, 2500);
    }, 0);
  }

  closeAlert() {
    this.showSuccessAlert = false;
    this.notificationMessage = '';
  }

}


