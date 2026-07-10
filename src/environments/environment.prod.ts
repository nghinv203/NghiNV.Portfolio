/**
 * Production environment.
 * Flip `useMock` to false once a real backend is available (see Phase 7 in the plan).
 */
export const environment = {
  production: true,

  baseUrl: '',
  apiBaseUrl: '/api',

  useMock: true,
  mockDelayMs: 500,
};
