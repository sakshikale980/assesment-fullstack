import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
// import jwt_decode from '../../../../../node_modules/jwt-decode/package.json';
@Injectable({ providedIn: 'root' })
export class AuthService {
  collapsed!: boolean;
  tokenData: any;
  tokenRefreshSub: any;
  voteAccessToken: any;
  isRefreshingToken: any;
  userObject!: any;
  // subject to trigger events
  private mySubject: Subject<any> = new Subject<string>();
  // observable to listen to events
  public readonly messageReceived$: Observable<string> = this.mySubject.asObservable();

  public _errorSubject = new BehaviorSubject<any>({});
  public error$ = this._errorSubject.asObservable();
  isReadOnly = true;

  constructor(private http: HttpClient) { }

  setError(error: any) {
    this._errorSubject.next(error);
  }

  getError() {
    return this._errorSubject.value;
  }

  checkExpiryTime(): any {
    if (!this.isAuthenticated()) return;

    let currentTimeMillis = new Date().getTime();
    let expirationTimeMillis = new Date(this.getTokenExpiration() * 1000).getTime();
    const issueTimeMs = new Date(this.getTokenIssueTime() * 1000).getTime();
    const timeElapsed = currentTimeMillis - issueTimeMs;
    const timeRemaining = expirationTimeMillis - currentTimeMillis;
    if (timeElapsed > timeRemaining && !this.isRefreshingToken) {
      this.refreshToken();
    }
  }

  getTokenExpiration(): any {
    if (this.isAuthenticated()) {
      let authInfo: any = jwt_decode(this.getToken());
      if (authInfo.exp) {
        return authInfo.exp as number;
      }
    }
    return null;
  }
  getToken(): any {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    } else {
      return true;
    }
  }
  getTokenIssueTime(): any {
    if (this.isAuthenticated()) {
      let authInfo: any = this.getToken();
      if (authInfo.nbf) {
        return authInfo.nbf as number;
      }
    }
    return null;
  }

  refreshToken() {
    // TODO -
    this.isRefreshingToken = true;
    const refreshToken = localStorage.getItem('refreshToken');
    const url = `${environment.BASE_URL}auth/token/refresh`;
    const body = {
      refreshToken: refreshToken,
    };
    this.http.post<any>(url, body).subscribe((response) => {
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
        this.isRefreshingToken = false;
      }
    });
  }

  getUserInfo(): any | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwt_decode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    } else {
      return null;
    }
  }

}
function jwt_decode(arg0: any): any {
  throw new Error('Function not implemented.');
}

