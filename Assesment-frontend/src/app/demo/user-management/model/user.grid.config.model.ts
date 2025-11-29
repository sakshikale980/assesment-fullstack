import { GridColumnClass, PaginationConfig } from "src/app/theme/shared/data-table/data-table/grid.config.model";


export const app_userTableConfig: GridColumnClass[] = [
  { id: 1, headerName: 'Name', field: 'userName' },
  { id: 2, headerName: 'Email', field: 'email', isEmail: true },
  { id: 3, headerName: 'Action', field: 'action', isAction: true, isEdit: true, isDelete: true }
];

export const app_userBulkGridConfig: PaginationConfig = {
    pageOptions: [10, 20, 50],
    defaultPageSize: 1,
    showCurrentPageReport: true,
    paginator: true,
    totalRecords: 0
};
