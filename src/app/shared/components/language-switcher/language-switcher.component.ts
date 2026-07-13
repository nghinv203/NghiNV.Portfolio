import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { LanguageService } from '@core/services/language.service';
import { AppLang } from '@models/index';

interface LangOption {
  code: AppLang;
  /** Autonym — each language shown in its own name. */
  label: string;
  flag: string;
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
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly options: LangOption[] = [
    { code: 'vi', label: 'Tiếng Việt', flag: '/images/flags/vn.svg' },
    { code: 'en', label: 'English', flag: '/images/flags/gb.svg' },
    { code: 'ja', label: '日本語', flag: '/images/flags/jp.svg' },
  ];

  protected readonly open = signal(false);
  protected readonly current = computed(
    () => this.options.find((o) => o.code === this.language.lang()) ?? this.options[0],
  );

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected select(code: AppLang): void {
    this.language.use(code);
    this.open.set(false);
  }

  /** Close when clicking anywhere outside the component. */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.open.set(false);
  }
}
