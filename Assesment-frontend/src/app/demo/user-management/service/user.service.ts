import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUCT_API } from 'src/app/theme/shared/constant/service-api.constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  getUserList(pageSize: number, pageNumber: number): Observable<any> {
    return this.http.get(
      `${environment.BASE_URL + PRODUCT_API.GET_USER}?page=${pageNumber}&limit=${pageSize}`
    );
  }

  addUser(payload: any) {
    return this.http.post(environment.BASE_URL + PRODUCT_API.ADD_USER, payload);
  }

  updateUser(id: string, payload: any) {
    return this.http.put(environment.BASE_URL + PRODUCT_API.UPDATE_USER + id, payload);
  }

  getUserById(id: string) {
    return this.http.get(environment.BASE_URL + PRODUCT_API.GET_USER_BY_ID + id);
  }

}
