import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { ThemeService } from '@core/services/theme.service';
import { TransitionService } from '@core/services/transition.service';
import { ThemeMode } from '@models/ui.model';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  protected readonly theme = inject(ThemeService);
  private readonly transition = inject(TransitionService);

  protected toggle(): void {
    const next: ThemeMode = this.theme.isDark() ? 'light' : 'dark';
    this.transition.play({
      kind: next === 'dark' ? 'theme-to-dark' : 'theme-to-light',
      apply: () => this.theme.set(next),
    });
  }
}
