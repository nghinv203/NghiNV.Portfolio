import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { LanguageService } from '@core/services/language.service';
import { AppLang } from '@models/index';

interface LangOption {
  code: AppLang;
  short: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  protected readonly language = inject(LanguageService);
  protected readonly options: LangOption[] = [
    { code: 'vi', short: 'VI' },
    { code: 'en', short: 'EN' },
    { code: 'ja', short: 'JP' },
  ];
}
