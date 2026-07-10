import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

/** Shown when a request fails. Emits `retry` when the user asks to try again. */
@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss',
})
export class ErrorStateComponent {
  readonly canRetry = input<boolean>(true);
  readonly retry = output<void>();
}
