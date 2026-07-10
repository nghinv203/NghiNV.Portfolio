import { AppLang } from './ui.model';

/** Text available in every supported language. Resolve with `localize()` for the active lang. */
export type LocalizedString = Record<AppLang, string>;

/** Envelope for a single resource. Kept identical for mock and real backend. */
export interface ApiResponse<T> {
  data: T;
}

/** Envelope for a collection. */
export interface ApiListResponse<T> {
  data: T[];
  total: number;
}

/** Payload returned by the contact endpoint. */
export interface ContactResult {
  ok: boolean;
  message?: string;
}
