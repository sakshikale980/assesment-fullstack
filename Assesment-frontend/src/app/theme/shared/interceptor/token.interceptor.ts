import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const gpToken = localStorage.getItem('token');
  // console.log(gpToken);

  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${gpToken}`
    }
  })

  return next(cloneRequest);

};

export { HttpInterceptorFn };
