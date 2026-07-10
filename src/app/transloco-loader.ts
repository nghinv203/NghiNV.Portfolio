import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { of, tap } from 'rxjs';

import { SSR_ORIGIN } from '@core/tokens/ssr.tokens';
import { environment } from '@env/environment';

/**
 * Loads translation JSON over HTTP.
 *
 * SSR-aware:
 *  - On the server, uses an absolute URL (relative fetch has no origin) and
 *    stashes the result in TransferState.
 *  - In the browser, reads TransferState first so translations rendered on the
 *    server are not fetched again after hydration.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly ssrOrigin = inject(SSR_ORIGIN, { optional: true }) ?? '';

  getTranslation(lang: string) {
    const stateKey = makeStateKey<Translation>(`transloco-${lang}`);

    if (this.isBrowser && this.transferState.hasKey(stateKey)) {
      const cached = this.transferState.get<Translation>(stateKey, {});
      this.transferState.remove(stateKey);
      return of(cached);
    }

    const base = this.isBrowser ? environment.baseUrl : this.ssrOrigin;
    return this.http.get<Translation>(`${base}/i18n/${lang}.json`).pipe(
      tap((translation) => {
        if (!this.isBrowser) {
          this.transferState.set(stateKey, translation);
        }
      }),
    );
  }
}
