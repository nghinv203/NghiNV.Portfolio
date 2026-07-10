/**
 * Development environment.
 * `environment.prod.ts` replaces this at build time (see angular.json fileReplacements).
 */
export const environment = {
  production: false,

  /** Origin used to resolve static assets (e.g. i18n JSON). Empty = same origin. */
  baseUrl: '',

  /** Base path for all data requests. The mock backend interceptor matches `/api/*`. */
  apiBaseUrl: '/api',

  /** When true, the mockBackendInterceptor serves data from local JSON instead of a real backend. */
  useMock: true,

  /** Simulated network latency (ms) for mock responses, so loading/skeleton states are visible. */
  mockDelayMs: 800,
};
