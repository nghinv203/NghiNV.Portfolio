/** Visual theme applied via `data-theme` on the document root. */
export type ThemeMode = 'light' | 'dark';

/** Supported UI languages. `ja` = Japanese (labelled "JP" in the UI). */
export type AppLang = 'vi' | 'en' | 'ja';

/** Async data lifecycle used by feature view-models to drive skeleton/empty/error UI. */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';
