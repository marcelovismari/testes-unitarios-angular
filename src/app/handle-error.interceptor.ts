import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class HandleErrorInterceptor
  implements HttpInterceptor
{
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';

        if (error.status === 0) {
          // A client-side or network error
          // occurred. Handle it accordingly.
          errorMsg = `An error occurred: ${JSON.stringify(
            error.error
          )}`;
        } else {
          // The backend returned an unsuccessful response
          // code. The response body may contain clues as
          // to what went wrong.
          errorMsg = `Backend returned code ${error.status}`;
        }

        return throwError(() => errorMsg);
      })
    );
  }
}
