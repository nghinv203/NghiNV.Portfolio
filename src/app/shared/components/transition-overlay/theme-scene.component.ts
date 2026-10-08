import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MascotComponent } from '@shared/components/mascot/mascot.component';

/**
 * Clay sun/moon (with the goat mascot) shown inside the theme-switch wash.
 * Pure CSS: the outgoing body sinks away while the incoming one pops up in its
 * place. Timing lives in the stylesheet (keep in sync with
 * TransitionService.DURATION).
 */
@Component({
  selector: 'app-theme-scene',
  standalone: true,
  imports: [MascotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-scene.component.html',
  styleUrl: './theme-scene.component.scss',
})
export class ThemeSceneComponent {
  /** true = day→night (sun sets, moon rises); false = the reverse. */
  readonly toDark = input.required<boolean>();

  protected readonly rays = [0, 1, 2, 3, 4, 5, 6, 7];
}
