import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

 // example
login(payload: any) {
  return this.http.post(`${environment.BASE_URL}api/auth/login`, payload);
}

}
