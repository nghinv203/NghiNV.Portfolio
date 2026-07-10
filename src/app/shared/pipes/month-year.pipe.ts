import { Pipe, PipeTransform } from '@angular/core';

import { AppLang } from '@models/index';

const LOCALE: Record<AppLang, string> = {
  vi: 'vi-VN',
  en: 'en-US',
  ja: 'ja-JP',
};

/**
 * Formats an ISO year-month string ("2025-11") as a localized "Nov 2025".
 * A null value (ongoing role) renders the provided present label.
 * Pass the active lang so it re-runs on language change.
 */
@Pipe({ name: 'monthYear', standalone: true })
export class MonthYearPipe implements PipeTransform {
  transform(value: string | null | undefined, lang: AppLang, presentLabel = ''): string {
    if (!value) {
      return presentLabel;
    }
    const [year, month] = value.split('-').map(Number);
    const date = new Date(year, (month || 1) - 1, 1);
    return new Intl.DateTimeFormat(LOCALE[lang], { month: 'short', year: 'numeric' }).format(date);
  }
}
