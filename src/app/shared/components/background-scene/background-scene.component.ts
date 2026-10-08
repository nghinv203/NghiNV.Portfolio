import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Site-wide decorative backdrop: a handful of soft green clay blobs that drift
 * slowly behind the page. Pure CSS (transform animation only) — no WebGL.
 */
@Component({
  selector: 'app-background-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './background-scene.component.html',
  styleUrl: './background-scene.component.scss',
})
export class BackgroundSceneComponent {}
