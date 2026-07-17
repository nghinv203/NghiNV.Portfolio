import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

type RGB = [number, number, number];

const SCENE_MS = 2000; // keep in sync with TransitionService.DURATION

interface Star {
  x: number;
  y: number;
  r: number;
  tw: number;
}
interface Cloud {
  x: number;
  y: number;
  s: number;
}

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const mix = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
const rgb = (c: RGB, alpha = 1): string =>
  `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${alpha})`;
const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

// Day / night palettes.
const SKY_TOP: [RGB, RGB] = [hexToRgb('#8ecae6'), hexToRgb('#060915')];
const SKY_HORIZON: [RGB, RGB] = [hexToRgb('#ffd9a0'), hexToRgb('#243063')];
const WATER: [RGB, RGB] = [hexToRgb('#8fb6cf'), hexToRgb('#0a1230')];
const MTN_BACK: [RGB, RGB] = [hexToRgb('#5a6f93'), hexToRgb('#0e1730')];
const MTN_FRONT: [RGB, RGB] = [hexToRgb('#33415e'), hexToRgb('#070c1a')];
const SUN: RGB = [255, 176, 82];
const MOON: RGB = [233, 240, 255];

/**
 * Canvas painting of a sun/moon setting behind a mountain range over a lake,
 * with a rippling reflection. Drives itself for ~2s (see SCENE_MS); the parent
 * overlay unmounts it when the transition ends.
 */
@Component({
  selector: 'app-theme-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-scene.component.html',
  styleUrl: './theme-scene.component.scss',
})
export class ThemeSceneComponent {
  /** true = day→night (sun sets, moon rises); false = the reverse. */
  readonly toDark = input.required<boolean>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private destroyed = false;
  private cleanup?: () => void;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.cleanup?.();
    });
    afterNextRender(() => this.run());
  }

  private run(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const toDark = this.toDark();

    let W = 0;
    let H = 0;
    let waterline = 0;
    let stars: Star[] = [];
    let clouds: Cloud[] = [];
    let backPts: number[] = [];
    let frontPts: number[] = [];

    const SEG = 10; // silhouette resolution

    const rebuild = (): void => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      waterline = Math.round(H * 0.64);

      stars = Array.from({ length: 90 }, () => ({
        x: Math.random() * W,
        y: Math.random() * waterline * 0.85,
        r: Math.random() * 1.3 + 0.3,
        tw: Math.random() * 3 + 1,
      }));

      clouds = Array.from({ length: 4 }, (_, i) => ({
        x: (i / 4) * W + Math.random() * W * 0.15,
        y: waterline * (0.16 + Math.random() * 0.34),
        s: 0.7 + Math.random() * 0.9,
      }));

      // Jagged silhouettes — deterministic per rebuild.
      const line = (lo: number, hi: number): number[] =>
        Array.from({ length: SEG + 1 }, () => waterline - (lo + Math.random() * (hi - lo)) * H);
      backPts = line(0.14, 0.3);
      frontPts = line(0.02, 0.18);
    };

    const skyAt = (y: number, night: number): RGB =>
      mix(
        mix(SKY_TOP[0], SKY_TOP[1], night),
        mix(SKY_HORIZON[0], SKY_HORIZON[1], night),
        clamp01(y / waterline),
      );

    const disc = (x: number, y: number, r: number, color: RGB, alpha: number, moon: boolean, night: number): void => {
      if (alpha <= 0.01) {
        return;
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      // Glow.
      const glow = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 3);
      glow.addColorStop(0, rgb(color, 0.5));
      glow.addColorStop(1, rgb(color, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 3, 0, Math.PI * 2);
      ctx.fill();
      // Disc.
      ctx.fillStyle = rgb(color);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (moon) {
        // Carve a crescent using the local sky colour.
        ctx.globalAlpha = alpha;
        ctx.fillStyle = rgb(skyAt(y, night));
        ctx.beginPath();
        ctx.arc(x + r * 0.5, y - r * 0.28, r * 0.92, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const range = (pts: number[], color: RGB): void => {
      ctx.fillStyle = rgb(color);
      ctx.beginPath();
      ctx.moveTo(0, waterline);
      for (let i = 0; i <= SEG; i++) {
        ctx.lineTo((i / SEG) * W, pts[i]);
      }
      ctx.lineTo(W, waterline);
      ctx.closePath();
      ctx.fill();
    };

    const draw = (t: number, p: number): void => {
      const night = toDark ? p : 1 - p;

      // Sky.
      const g = ctx.createLinearGradient(0, 0, 0, waterline);
      g.addColorStop(0, rgb(mix(SKY_TOP[0], SKY_TOP[1], night)));
      g.addColorStop(1, rgb(mix(SKY_HORIZON[0], SKY_HORIZON[1], night)));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // Stars.
      const starA = clamp01(night * 1.3 - 0.15);
      if (starA > 0.01) {
        ctx.fillStyle = '#fff';
        for (const s of stars) {
          ctx.globalAlpha = starA * (0.55 + 0.45 * Math.sin(t * s.tw + s.x));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Clouds.
      const cloudA = clamp01(1.1 - night * 1.5);
      if (cloudA > 0.01) {
        ctx.fillStyle = rgb([255, 255, 255], cloudA * 0.9);
        for (const c of clouds) {
          const cx = ((c.x + t * 6 * c.s) % (W + 200)) - 100;
          const u = 22 * c.s;
          for (const [ox, oy, or] of [
            [0, 0, 1],
            [u, -u * 0.4, 0.8],
            [2 * u, 0, 0.9],
            [u, u * 0.2, 0.7],
          ] as const) {
            ctx.beginPath();
            ctx.arc(cx + ox, c.y + oy, u * or, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Sun & moon (drawn before mountains so they set behind the ridge).
      const r = Math.min(W, H) * 0.07;
      const high = H * 0.2;
      const low = waterline + r * 0.6;
      disc(W * 0.42, lerp(high, low, night), r, SUN, clamp01(1.15 - night * 1.5), false, night);
      disc(W * 0.6, lerp(low, high, night), r, MOON, clamp01(night * 1.5 - 0.35), true, night);

      // Mountains.
      range(backPts, mix(MTN_BACK[0], MTN_BACK[1], night));
      range(frontPts, mix(MTN_FRONT[0], MTN_FRONT[1], night));

      // Lake reflection: mirror the above-water scene downward, rippled.
      const sh = 6;
      for (let d = 0; waterline + d < H; d += sh) {
        const srcY = waterline - d - sh;
        if (srcY < 0) {
          break;
        }
        const depth = d / (H - waterline);
        const xoff = Math.sin(d * 0.06 + t * 2.4) * (2 + depth * 5);
        ctx.drawImage(canvas, 0, srcY, W, sh, xoff, waterline + d, W, sh);
      }

      // Water tint — fades and colours the reflection with depth.
      const wc = mix(WATER[0], WATER[1], night);
      const wg = ctx.createLinearGradient(0, waterline, 0, H);
      wg.addColorStop(0, rgb(wc, 0.25));
      wg.addColorStop(1, rgb(wc, 0.72));
      ctx.fillStyle = wg;
      ctx.fillRect(0, waterline, W, H - waterline);

      // Shoreline highlight.
      ctx.fillStyle = rgb(mix([255, 240, 210], [120, 140, 190], night), 0.5);
      ctx.fillRect(0, waterline - 1, W, 2);
    };

    rebuild();
    const onResize = (): void => rebuild();
    window.addEventListener('resize', onResize);

    const start = performance.now();
    let raf = 0;
    const frame = (now: number): void => {
      if (this.destroyed) {
        return;
      }
      const t = (now - start) / 1000;
      const p = clamp01((now - start) / SCENE_MS);
      draw(t, p);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    this.cleanup = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }
}
