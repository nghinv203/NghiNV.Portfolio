import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { mockBackendInterceptor } from '@core/interceptors/mock-backend.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })), provideClientHydration(withEventReplay()), provideHttpClient(withFetch(), withInterceptors([errorInterceptor, mockBackendInterceptor])), provideTransloco({
        config: {
          availableLangs: ['en', 'vi', 'ja'],
          defaultLang: 'en',
          fallbackLang: 'en',
          missingHandler: { useFallbackTranslation: true },
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      })]
};
