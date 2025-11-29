import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ResponseHandlingService } from '../services/response-handling.service';

@Injectable({
  providedIn: 'root',
})
export class HttpTokenInterceptor implements HttpInterceptor {
  token: any = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private responseHandler: ResponseHandlingService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      // if (this.authService.checkExpiryTime()) {
      //   this.refreshToken(request, next);
      // }
      return this.HandleError(next, this.addAuthorizationHeader(request, this.token));
    }

    return this.HandleError(next, request);
  }

  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {

    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json'
        },
      });
    }
    return request;
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler) {
    this.authService.refreshToken(); //when refersh token API comes in scen uncommitee this
  }

  private HandleError(next: HttpHandler, request: HttpRequest<unknown>) {
    return next.handle(request).pipe(
      catchError((err) => {
        this.responseHandler.handleError(err, new Map(), false, []);
        if (err.status == 500) {
          // this.router.navigate(['/error']);
          this.router.navigate(['/500']);
        }
        if (err.status == 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
        // return err;
      }),
    );
  }
}
