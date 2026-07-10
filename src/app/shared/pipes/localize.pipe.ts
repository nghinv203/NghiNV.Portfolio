import { Pipe, PipeTransform } from '@angular/core';

import { AppLang, LocalizedString } from '@models/index';

/**
 * Resolves a `LocalizedString` to the active language, falling back to English.
 * Pure: pass the active lang signal's value so it re-runs on language change,
 * e.g. `{{ project.summary | localize: lang() }}`.
 */
@Pipe({ name: 'localize', standalone: true })
export class LocalizePipe implements PipeTransform {
  transform(value: LocalizedString | null | undefined, lang: AppLang): string {
    if (!value) {
      return '';
    }
    return value[lang] || value.en || '';
  }
}
