import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type SkeletonVariant = 'box' | 'text' | 'circle';

/**
 * Shimmer placeholder primitive. Compose several to mirror a real layout so
 * content swaps in without layout shift, e.g.:
 *   <app-skeleton variant="circle" width="64px" height="64px" />
 *   <app-skeleton variant="text" width="60%" />
 * Colors come from theme tokens, so it works in light and dark.
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  host: {
    class: 'skeleton',
    role: 'presentation',
    'aria-hidden': 'true',
    '[class.skeleton--text]': "variant() === 'text'",
    '[class.skeleton--circle]': "variant() === 'circle'",
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[style.border-radius]': 'radius()',
  },
})
export class SkeletonComponent {
  readonly variant = input<SkeletonVariant>('box');
  readonly width = input<string>();
  readonly height = input<string>();
  readonly radius = input<string>();
}
