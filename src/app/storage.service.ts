import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getJWT(): string | null {
    return localStorage.getItem('access-token');
  }
}
