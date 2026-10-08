import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Site mascot: a friendly clay goat. Purely decorative (aria-hidden); blinks
 * and wiggles its ears with CSS only. Size follows the `size` input (px).
 */
@Component({
  selector: 'app-mascot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mascot.component.html',
  styleUrl: './mascot.component.scss',
})
export class MascotComponent {
  readonly size = input(120);
}
