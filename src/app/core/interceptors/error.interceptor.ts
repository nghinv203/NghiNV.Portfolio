import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';

/**
 * Central logging point for failed HTTP requests. Feature services still
 * receive the error so they can surface an error/retry state to the user;
 * this only normalises logging (and stays quiet during SSR).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isBrowser) {
        // eslint-disable-next-line no-console
        console.error(`[HTTP ${error.status}] ${req.method} ${req.url}`, error.error);
      }
      return throwError(() => error);
    }),
  );
};
