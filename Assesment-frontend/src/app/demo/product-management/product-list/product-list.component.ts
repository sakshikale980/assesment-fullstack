import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SearchComponent } from 'src/app/theme/shared/components/search/search.component';
import { DataTableComponent } from 'src/app/theme/shared/data-table/data-table/data-table.component';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { app_productBulkGridConfig, app_productTableConfig } from '../Model/product.grid.config.model';
import { Product } from '../Model/model';
import { DeleteComponent } from 'src/app/theme/shared/delete/delete/delete.component';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule, DataTableComponent, SearchComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productList: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  count: number = 0;
  pages: any
  sortOrder: string = '';
  showSuccessAlert: boolean = false;
  notificationMessage: string = '';

  @ViewChild('alertContainer') alertcontainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  tableConfig = app_productTableConfig;
  paginationConfig = app_productBulkGridConfig;

  config = {
    pageNumber: this.pageNumber,
    pageSize: this.pageSize
  };

  constructor(
    private productService: ProductService,
    private route: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getProductList();
  }

  getProductList(): void {
    this.isLoading = true;
    if (isNaN(this.pageNumber) || this.pageNumber <= 0) {
      this.pageNumber = 1;
    }
    this.productService.getProductList(this.pageSize, this.pageNumber, this.searchTerm, this.sortOrder
    ).subscribe({
      next: (res: any) => {
        this.count = res.totalItems || res.count || res.length;
        this.totalPages = res.totalPages || Math.ceil(this.count / this.pageSize);
        const data = (res.products || res.rows || res).map((item: any) => {
          return {
            ...item,
            categoryName: item.category?.name || '-'
          };
        });

        this.productList = data;
      },

      error: (err) => {
        console.error('Error fetching product list', err);
      },

      complete: () => {
        this.isLoading = false;
      }
    });
  }

  confirmDelete(category: Product) {
    const modalRef = this.modalService.open(DeleteComponent);
    modalRef.componentInstance.message = 'Are you sure you want to delete this Product?';

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

    this.productService.deleteProductService(id, payload).subscribe({
      next: (res) => {
        this.showNotification({ success: true, message: "Category deleted successfully!" });
        this.getProductList();
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.productService.bulkUpload(file).subscribe({
        next: (res) => {
          this.showNotification({
            success: true,
            message: res.message || 'Bulk upload successful'
          });
          this.getProductList();
        },
        error: (err) => {
          this.showNotification({
            success: false,
            message: err.error?.message || 'Bulk upload failed'
          });
        }
      });
    }
    this.fileInput.nativeElement.value = '';
  }


  downloadReport() {
    this.productService.downloadReport().subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `products_${Date.now()}.xlsx`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }

  searchProduct(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageNumber = 1;
    this.config.pageNumber = this.pageNumber;
    this.getProductList();
  }

  changeSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOrder = value;
    this.pageNumber = 1;
    this.getProductList();
  }

  changedPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.config.pageSize = pageSize;
    this.getProductList();
  }

  goToPage(page: number) {
    this.pageNumber = page;
    this.config.pageNumber = this.pageNumber;
    this.getProductList();
  }

  changePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.config.pageSize = this.pageSize;
    this.getProductList();
  }

  navigateToAddProduct() {
    this.route.navigate(['/product/add']);
  }

  navigateToEditProduct(event: any) {
    this.route.navigate(['/product/edit'], { queryParams: { id: event.id } });
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
        this.notificationMessage = res.message;
        alertContainer.classList.add('alert-success');
      } else {
        this.notificationMessage = "Product updated successfully!";
        alertContainer.classList.add('alert-success');
      }

      setTimeout(() => {
        this.showSuccessAlert = false;
        alertContainer.classList.remove('alert-success');
        alertContainer.classList.remove('alert-danger');
      }, 3000);
    }, 0);
  }

  closeAlert() {
    this.showSuccessAlert = false;
    this.notificationMessage = '';
  }
}
