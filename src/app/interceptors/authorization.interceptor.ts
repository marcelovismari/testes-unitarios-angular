import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';

@Injectable()
export class AuthorizationInterceptor
  implements HttpInterceptor
{
  constructor(private storageService: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const jwt: string | null = this.storageService.getJWT();

    if (jwt) {
      req = req.clone({
        headers: req.headers.set('Authorization', jwt),
      });
    }

    return next.handle(req);
  }
}
