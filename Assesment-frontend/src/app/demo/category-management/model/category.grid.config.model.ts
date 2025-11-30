import { GridColumnClass, PaginationConfig } from "src/app/theme/shared/data-table/data-table/grid.config.model";

export const app_categoryTableConfig: GridColumnClass[] = [
  { id: 1, headerName: 'Name', field: 'name' },
  { id: 3, headerName: 'Action', field: 'action', isAction: true, isEdit: true, isDelete: true}
];

export const app_categoryBulkGridConfig: PaginationConfig = {
    pageOptions: [10, 20, 50],
    defaultPageSize: 1,
    showCurrentPageReport: true,
    paginator: true,
    totalRecords: 0
};
