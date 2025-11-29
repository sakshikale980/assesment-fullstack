import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [FormsModule,CommonModule,NgxSkeletonLoaderModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnChanges {

  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() pageNumber: number = 1;
  @Input() pageSize: number = 10;
  @Input() count: number = 0;
  @Input() pages: number[] = [];
  @Input() totalPages: number = 0;
  @Input() paginationConfig: any = { pageOptions: [], defaultPageSize: 10, showCurrentPageReport: true, paginator: false, totalRecords: 0 };
  
  @Output() navigateToEdit = new EventEmitter<any>();
  @Output() navigateToView = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() goToPage = new EventEmitter<number>();
  @Output() changePageSize = new EventEmitter<number>();
  @Output() imagePopup = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageNumber'] || changes['pageSize'] || changes['count']) {
      this.calculatePages();
    }
  }

  edit(event: any) {
    this.navigateToEdit.emit(event);
  }

  view(event: any) {
    this.navigateToView.emit(event);
  }

  deleteData(event: any) {
    this.deleteItem.emit(event);
  }

  openImageModal(imageURL: any){
    this.imagePopup.emit(imageURL);
  }

  onPageChange(page: number) {
    this.goToPage.emit(page);
  }

  onPageSizeChange(event: any) {
    const pageSize = Number(event.target.value);
    this.changePageSize.emit(pageSize);
  }

  calculatePages() {
    const maxVisiblePages = 4;
    this.totalPages = Math.ceil(this.count / this.pageSize);
    const currentPage = this.pageNumber;

    if (this.totalPages <= maxVisiblePages) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      this.pages = [];
      this.pages.push(1);

      const maxEllipsisPages = maxVisiblePages - 2;
      const pagesBefore = Math.floor((maxEllipsisPages - 1) / 2);
      const pagesAfter = Math.ceil((maxEllipsisPages - 1) / 2);

      let startPage = currentPage - pagesBefore;
      let endPage = currentPage + pagesAfter;

      if (startPage <= 1) {
        startPage = 2;
        endPage = maxEllipsisPages + 1;
      } else if (endPage >= this.totalPages) {
        endPage = this.totalPages - 1;
        startPage = this.totalPages - maxEllipsisPages;
      }

      if (startPage > 2) {
        this.pages.push(-1);
      }
      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }
      if (endPage < this.totalPages - 1) {
        this.pages.push(-1);
      }
      this.pages.push(this.totalPages);
    }
  }
}
