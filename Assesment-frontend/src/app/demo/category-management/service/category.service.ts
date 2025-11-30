import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUCT_API } from 'src/app/theme/shared/constant/service-api.constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategoryList(pageSize: number, pageNumber: number): Observable<any> {
    return this.http.get(
      `${environment.BASE_URL + PRODUCT_API.GET_CATEGORY}?page=${pageNumber}&limit=${pageSize}`
    );
  }

  addCategory(payload: any) {
    return this.http.post(environment.BASE_URL + PRODUCT_API.ADD_CATEGORY, payload);
  }

  updateCategory(id: string, payload: any) {
    return this.http.put(environment.BASE_URL + PRODUCT_API.UPDATE_CATEGORY + id, payload);
  }

  getCategoryById(id: string) {
    return this.http.get(environment.BASE_URL + PRODUCT_API.GET_CATEGORY_BY_ID + id);
  }

  deleteCategoryService(id: string, payload: any): Observable<any> {
    return this.http.delete(
      environment.BASE_URL + PRODUCT_API.DELETE_CATEGORY + id,
      { body: payload }
    );
  }

}
