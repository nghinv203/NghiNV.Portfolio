/**
 * Keys used for persisting user preferences.
 * Written to BOTH localStorage (client reads) and a cookie (so the SSR server
 * can render the correct theme/language on first paint without a flash).
 */
export const STORAGE_KEYS = {
  theme: 'portfolio.theme',
  lang: 'portfolio.lang',
} as const;
