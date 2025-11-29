import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BEEAH_API } from 'src/app/theme/shared/constant/service-api.constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getUserList(pageSize: number, pageNumber: any, searchTerm: string): Observable<any> {
    return this.http.get(environment.BASE_URL + BEEAH_API.GET_USER + pageSize + '&pageNumber=' + pageNumber + '&searchTerm=' + searchTerm)
  }
  
  addUser(payload: any) {
    return this.http.post(environment.BASE_URL + BEEAH_API.ADD_USER, payload)
  }

  getRoleList(): Observable<any> {
    return this.http.get(environment.BASE_URL + BEEAH_API.GET_ROLE)
  }

  deleteUserSer(payload: any): Observable<any> {
    return this.http.put<any>(environment.BASE_URL + BEEAH_API.UPDATE_USER+ payload.id, payload)
  }

  updateUser(event: any, id: any) {
    return this.http.put(environment.BASE_URL + BEEAH_API.UPDATE_USER + id, event)
  }

  getUserById(id: any): Observable<any> {
    return this.http.get<any>(environment.BASE_URL + BEEAH_API.GET_USERBYID + id)
  }
}
