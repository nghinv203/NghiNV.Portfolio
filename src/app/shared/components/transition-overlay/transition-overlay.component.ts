import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TransitionService } from '@core/services/transition.service';
import { MascotComponent } from '@shared/components/mascot/mascot.component';
import { ThemeSceneComponent } from './theme-scene.component';

/**
 * Renders the full-screen scene shown while the theme or language changes.
 * Purely presentational — all timing lives in {@link TransitionService}.
 * The element only exists while a transition is active, so its scene restarts
 * cleanly on every switch.
 */
@Component({
  selector: 'app-transition-overlay',
  standalone: true,
  imports: [ThemeSceneComponent, MascotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transition-overlay.component.html',
  styleUrl: './transition-overlay.component.scss',
})
export class TransitionOverlayComponent {
  protected readonly transition = inject(TransitionService);
}
