import { GridColumnClass, PaginationConfig } from "src/app/theme/shared/data-table/data-table/grid.config.model";

export const app_productTableConfig: GridColumnClass[] = [
  { id: 1, headerName: 'Product Name', field: 'name' },
  { id: 2, headerName: 'Category', field: 'categoryName' },
  { id: 3, headerName: 'Price', field: 'price' },
  { id: 5, headerName: 'Action', field: 'action', isAction: true, isEdit: true, isDelete: true }
];

export const app_productBulkGridConfig: PaginationConfig = {
  pageOptions: [10, 20, 50],
  defaultPageSize: 10,
  showCurrentPageReport: true,
  paginator: true,
  totalRecords: 0
};
