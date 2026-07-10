import { LocalizedString } from './api.model';

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  /** ISO date. */
  issuedDate: string;
  credentialUrl?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: LocalizedString;
  field: LocalizedString;
  startYear: number;
  endYear: number | null;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company?: string;
  avatarUrl?: string;
  quote: LocalizedString;
}
