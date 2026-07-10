import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { SSR_COOKIES } from '@core/tokens/ssr.tokens';
import { readCookie, writeCookie } from '@core/utils/cookie.util';
import { ThemeMode } from '@models/ui.model';

/**
 * Owns the light/dark theme.
 *
 * Resolve order for the initial value: user-saved choice -> OS preference -> light.
 * The choice is persisted to localStorage + cookie ONLY when the user explicitly
 * picks one (toggle/set), so that until then the app keeps following the OS.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ssrCookies = inject(SSR_COOKIES, { optional: true }) ?? '';
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _theme = signal<ThemeMode>(this.resolveInitial());

  /** Current theme (readonly signal). */
  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    // Reflect the theme onto <html data-theme> on both server and client.
    effect(() => {
      this.doc.documentElement.setAttribute('data-theme', this._theme());
    });

    // Follow live OS changes until the user has made an explicit choice.
    if (this.isBrowser && !this.hasSavedPreference()) {
      const mq = this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)');
      mq?.addEventListener('change', (e) => {
        if (!this.hasSavedPreference()) {
          this._theme.set(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /** Explicitly set the theme and persist the choice. */
  set(theme: ThemeMode): void {
    this._theme.set(theme);
    this.persist(theme);
  }

  toggle(): void {
    this.set(this._theme() === 'dark' ? 'light' : 'dark');
  }

  private resolveInitial(): ThemeMode {
    const saved = this.readSaved();
    if (saved) {
      return saved;
    }
    if (this.isBrowser) {
      const prefersDark = this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    // Server has no OS signal; :root default + no-FOUC script handle the rest.
    return 'light';
  }

  private readSaved(): ThemeMode | null {
    const raw = this.isBrowser
      ? this.safeLocalStorageGet(STORAGE_KEYS.theme)
      : readCookie(this.ssrCookies, STORAGE_KEYS.theme);
    return raw === 'light' || raw === 'dark' ? raw : null;
  }

  private hasSavedPreference(): boolean {
    return this.readSaved() !== null;
  }

  private persist(theme: ThemeMode): void {
    if (!this.isBrowser) {
      return;
    }
    this.safeLocalStorageSet(STORAGE_KEYS.theme, theme);
    writeCookie(this.doc, STORAGE_KEYS.theme, theme);
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
      /* storage blocked (private mode / disabled) — non-fatal */
    }
  }
}
