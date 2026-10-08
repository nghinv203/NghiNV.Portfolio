import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TECH_ICONS } from '@shared/data/tech-stack.icons';

/** One clay chip on the hero's orbit, with its resting angle and size. */
interface OrbitChip {
  title: string;
  path: string;
  color: string;
  /** Resting angle on the ring, in degrees. */
  angle: number;
  /** Chip scale relative to the base size. */
  scale: number;
}

const CHIP_COUNT = 9;

/**
 * Decorative hero orbit: the user's core tech-stack logos sit on clay chips
 * that circle the avatar. Pure CSS (transform animation only) — no WebGL.
 * Honours prefers-reduced-motion through the global reset.
 */
@Component({
  selector: 'app-hero-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-scene.component.html',
  styleUrl: './hero-scene.component.scss',
})
export class HeroSceneComponent {
  protected readonly chips: OrbitChip[] = TECH_ICONS.slice(0, CHIP_COUNT).map((icon, i, all) => ({
    ...icon,
    angle: (i / all.length) * 360,
    scale: 0.9 + (i % 3) * 0.12,
  }));
}
