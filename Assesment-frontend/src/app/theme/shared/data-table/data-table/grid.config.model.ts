export interface PaginationConfig {
    pageOptions: number[];
    defaultPageSize: number;
    showCurrentPageReport: boolean;
    paginator: boolean;
    totalRecords: number;
  }
  
  export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
    pageOptions: [10, 20, 50],
    defaultPageSize: 10,
    showCurrentPageReport: true,
    paginator: true,
    totalRecords: 0,
  };
  export interface GridColumnClass {
    id: number;
    headerName: string;
    field: string;
    isEdit?: boolean;
    isAction?: boolean;
    isDelete?: boolean;
    isView?: boolean;
    isImage?: boolean;
    isDateTimeFormatReq?: boolean;
    isEmail?: boolean;
    isDateTimeRequired?: boolean;
    isStatus?: boolean;
  }
  