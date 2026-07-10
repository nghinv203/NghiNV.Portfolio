import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { SSR_ACCEPT_LANGUAGE, SSR_COOKIES } from '@core/tokens/ssr.tokens';
import { readCookie, writeCookie } from '@core/utils/cookie.util';
import { AppLang } from '@models/ui.model';

const SUPPORTED: readonly AppLang[] = ['en', 'vi', 'ja'];
const FALLBACK: AppLang = 'en';

/**
 * Owns the active UI language.
 *
 * Detect order for the initial value: user-saved -> browser/Accept-Language -> EN.
 * Persisted to localStorage + cookie only on explicit change, so the choice
 * survives reloads and lets SSR render the right language on first paint.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ssrCookies = inject(SSR_COOKIES, { optional: true }) ?? '';
  private readonly ssrAcceptLang = inject(SSR_ACCEPT_LANGUAGE, { optional: true }) ?? '';
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _lang = signal<AppLang>(this.resolveInitial());
  readonly lang = this._lang.asReadonly();
  readonly available = SUPPORTED;

  constructor() {
    this.apply(this._lang());
  }

  /** Set the active language and persist the choice. */
  use(lang: AppLang): void {
    if (!SUPPORTED.includes(lang)) {
      return;
    }
    this._lang.set(lang);
    this.apply(lang);
    this.persist(lang);
  }

  private apply(lang: AppLang): void {
    this.transloco.setActiveLang(lang);
    this.doc.documentElement.setAttribute('lang', lang);
  }

  private resolveInitial(): AppLang {
    return this.readSaved() ?? this.detectFromEnvironment() ?? FALLBACK;
  }

  private readSaved(): AppLang | null {
    const raw = this.isBrowser
      ? this.safeLocalStorageGet(STORAGE_KEYS.lang)
      : readCookie(this.ssrCookies, STORAGE_KEYS.lang);
    return this.normalize(raw);
  }

  private detectFromEnvironment(): AppLang | null {
    const raw = this.isBrowser
      ? this.doc.defaultView?.navigator.language
      : this.ssrAcceptLang.split(',')[0];
    return this.normalize(raw);
  }

  /** Map a locale string ("en-US", "vi", "ja-JP", "jp") to a supported language. */
  private normalize(value: string | null | undefined): AppLang | null {
    if (!value) {
      return null;
    }
    const code = value.trim().toLowerCase().slice(0, 2);
    if (code === 'vi') return 'vi';
    if (code === 'ja' || code === 'jp') return 'ja';
    if (code === 'en') return 'en';
    return null;
  }

  private persist(lang: AppLang): void {
    if (!this.isBrowser) {
      return;
    }
    this.safeLocalStorageSet(STORAGE_KEYS.lang, lang);
    writeCookie(this.doc, STORAGE_KEYS.lang, lang);
  }

  private safeLocalStorageGet(key: string): string | null {
    try {
      return this.doc.defaultView?.localStorage.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private safeLocalStorageSet(key: string, value: string): void {
    try {
      this.doc.defaultView?.localStorage.setItem(key, value);
    } catch {
      /* storage blocked — non-fatal */
    }
  }
}
