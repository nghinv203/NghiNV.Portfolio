import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, switchMap, throwError, timer } from 'rxjs';

import { resolveMockRequest } from '@mock/mock-backend';
import { environment } from '@env/environment';

/**
 * Serves `/api/*` requests from local mock data when `environment.useMock` is on.
 * Feature services use a real HttpClient, so turning this off (Phase 7) points
 * them at the real backend with no other code changes.
 *
 * Simulated states via query param (for exercising the UI):
 *   ?mock=error → 500 response (after the usual latency)
 *   ?mock=empty → empty collection / null resource
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMock || !req.url.includes('/api/')) {
    return next(req);
  }

  const flag = new URLSearchParams(req.url.split('?')[1] ?? '').get('mock');
  // timer(...) delays BOTH next and error notifications (unlike delay()).
  const after = <T>(factory: () => Observable<T>) =>
    timer(environment.mockDelayMs).pipe(switchMap(factory));

  if (flag === 'error') {
    return after(() => throwError(() => makeError(req.url)));
  }

  const resolved = resolveMockRequest(req);
  if (!resolved) {
    // Unknown mock route — fall through (would 404 against a real server).
    return next(req);
  }

  if (resolved.status >= 400) {
    return after(() => throwError(() => makeError(req.url, resolved.status, resolved.body)));
  }

  const body = flag === 'empty' ? emptyLike(resolved.body) : resolved.body;
  return after(() => of(new HttpResponse({ status: resolved.status, body, url: req.url })));
};

/** Replace a resolved payload with its empty equivalent (empty list or null resource). */
function emptyLike(body: unknown): unknown {
  if (body && typeof body === 'object' && 'total' in (body as Record<string, unknown>)) {
    return { data: [], total: 0 };
  }
  return { data: null };
}

function makeError(url: string, status = 500, body: unknown = { message: 'Mock server error' }): HttpErrorResponse {
  return new HttpErrorResponse({
    status,
    statusText: status === 404 ? 'Not Found' : 'Internal Server Error',
    url,
    error: body,
  });
}
