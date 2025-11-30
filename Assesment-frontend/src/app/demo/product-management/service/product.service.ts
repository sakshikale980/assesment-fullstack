import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUCT_API } from 'src/app/theme/shared/constant/service-api.constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }
  
  getProductList(pageSize: number, pageNumber: number, search?: string, sort?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', pageSize.toString());
    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);
    return this.http.get(environment.BASE_URL + PRODUCT_API.GET_PRODUCT, { params });
  }

  create(formData: FormData): Observable<any> {
    return this.http.post(environment.BASE_URL + PRODUCT_API.ADD_PRODUCT, formData);
  }

  update(id: string, formData: FormData): Observable<any> {
    return this.http.put(environment.BASE_URL + PRODUCT_API.UPDATE_PRODUCT + id, formData);
  }

  getById(id: string): Observable<any> {
    return this.http.get(environment.BASE_URL + PRODUCT_API.GET_PRODUCT_BY_ID + id);
  }

  deleteProductService(id: string, payload: any): Observable<any> {
    return this.http.delete(
      environment.BASE_URL + PRODUCT_API.DELETE_PRODUCT + id,
      { body: payload }
    );
  }

  bulkUpload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(environment.BASE_URL + PRODUCT_API.BULK_UPLOAD, formData);
  }

  downloadReport(limit?: number): Observable<Blob> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get(environment.BASE_URL + PRODUCT_API.REPORT_DOWNLOAD, {
      params,
      responseType: 'blob'
    });
  }
}


