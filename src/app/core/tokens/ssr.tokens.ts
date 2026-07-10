import { InjectionToken } from '@angular/core';

/**
 * Raw `Cookie` request header, provided by the Express server during SSR
 * (see src/server.ts). Absent (optional) in the browser — read localStorage there.
 */
export const SSR_COOKIES = new InjectionToken<string>('SSR_COOKIES');

/**
 * Request origin (e.g. `https://host`), provided during SSR so the Transloco
 * loader can build an absolute URL for i18n JSON (relative fetch fails on the server).
 */
export const SSR_ORIGIN = new InjectionToken<string>('SSR_ORIGIN');

/**
 * Raw `Accept-Language` request header, provided during SSR so the initial
 * language can match the browser before hydration (server has no `navigator`).
 */
export const SSR_ACCEPT_LANGUAGE = new InjectionToken<string>('SSR_ACCEPT_LANGUAGE');
