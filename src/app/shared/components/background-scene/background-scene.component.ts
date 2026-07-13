import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import type * as ThreeNS from 'three';

/** A drifting body plus its per-frame motion parameters. */
interface Drifter {
  mesh: ThreeNS.Mesh;
  velY: number;
  spinX: number;
  spinY: number;
  swayAmp: number;
  swaySpeed: number;
  swayPhase: number;
  baseX: number;
}

/**
 * Site-wide animated 3D backdrop. A field of faceted crystals drifts upward
 * and rebinds at the bottom, so the whole portfolio feels alive as you scroll.
 * Motion is driven by three inputs: a constant drift, the scroll position
 * (parallax) and the pointer (gentle tilt).
 *
 * Same guardrails as the hero scene: browser-only, lazily imported, theme
 * aware, honours prefers-reduced-motion and pauses when the tab is hidden.
 */
@Component({
  selector: 'app-background-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './background-scene.component.html',
  styleUrl: './background-scene.component.scss',
})
export class BackgroundSceneComponent {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private destroyed = false;
  private dispose?: () => void;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.dispose?.();
    });

    afterNextRender(() => {
      void this.init();
    });
  }

  private async init(): Promise<void> {
    const THREE = await import('three');
    if (this.destroyed) {
      return;
    }

    const canvas = this.canvasRef().nativeElement;

    let renderer: ThreeNS.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2, 3, 6);
    const primaryLight = new THREE.PointLight(0xffffff, 20, 80, 2);
    primaryLight.position.set(-8, 4, 6);
    const accentLight = new THREE.PointLight(0xffffff, 16, 80, 2);
    accentLight.position.set(8, -5, 4);
    scene.add(ambient, keyLight, primaryLight, accentLight);

    const readColor = (token: string, fallback: string): ThreeNS.Color => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      return new THREE.Color(raw || fallback);
    };

    // Vertical half-extent of the frustum at the z=0 plane — used to spawn and
    // recycle drifters just outside the visible area.
    const FOV_RAD = (camera.fov * Math.PI) / 180;
    const halfH = Math.tan(FOV_RAD / 2) * camera.position.z;

    const group = new THREE.Group();
    scene.add(group);

    const geometries: ThreeNS.BufferGeometry[] = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.7, 0.28, 12, 30),
    ];
    const themed: { material: ThreeNS.MeshStandardMaterial; token: 'primary' | 'accent' }[] = [];
    const drifters: Drifter[] = [];

    const COUNT = 34;
    const spanX = 22;
    const spanY = halfH * 2 + 4;

    for (let i = 0; i < COUNT; i++) {
      const geometry = geometries[i % geometries.length];
      const token: 'primary' | 'accent' = i % 2 === 0 ? 'primary' : 'accent';
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 0.35,
        metalness: 0.35,
        roughness: 0.35,
        flatShading: true,
        transparent: true,
        opacity: 0.85,
        wireframe: i % 3 === 0,
      });
      themed.push({ material, token });

      const mesh = new THREE.Mesh(geometry, material);
      const size = 0.28 + (i % 5) * 0.16;
      mesh.scale.setScalar(size);

      const baseX = (i / COUNT - 0.5) * spanX + (Math.sin(i * 5.3) * spanX) / COUNT;
      const z = -6 + (i % 6);
      const y = (Math.sin(i * 2.7) * 0.5) * spanY - spanY / 2 + (i / COUNT) * spanY;
      mesh.position.set(baseX, y, z);
      mesh.rotation.set(i, i * 0.7, 0);
      group.add(mesh);

      drifters.push({
        mesh,
        velY: 0.35 + (i % 5) * 0.12,
        spinX: 0.15 + (i % 4) * 0.08,
        spinY: 0.2 + (i % 3) * 0.09,
        swayAmp: 0.4 + (i % 4) * 0.25,
        swaySpeed: 0.3 + (i % 5) * 0.12,
        swayPhase: i * 1.3,
        baseX,
      });
    }

    const applyColors = (): void => {
      const primary = readColor('--color-primary', '#4f46e5');
      const accent = readColor('--color-accent', '#0891b2');
      for (const { material, token } of themed) {
        const c = token === 'primary' ? primary : accent;
        material.color.copy(c);
        material.emissive.copy(c);
      }
      primaryLight.color.copy(primary);
      accentLight.color.copy(accent);
      if (!running) {
        renderFrame(0);
      }
    };

    const pointer = { x: 0, y: 0 };
    let scrollParallax = 0;

    const clock = new THREE.Clock();
    let elapsed = 0;
    let running = false;
    let frame = 0;

    const topY = spanY / 2;
    const bottomY = -spanY / 2;

    const renderFrame = (dt: number): void => {
      elapsed += dt;
      for (const d of drifters) {
        d.mesh.position.y += d.velY * dt;
        if (d.mesh.position.y > topY) {
          d.mesh.position.y = bottomY;
        }
        d.mesh.position.x = d.baseX + Math.sin(elapsed * d.swaySpeed + d.swayPhase) * d.swayAmp;
        d.mesh.rotation.x += d.spinX * dt;
        d.mesh.rotation.y += d.spinY * dt;
      }

      // Pointer tilts the whole field; scroll nudges it for depth parallax.
      group.rotation.y += (pointer.x * 0.25 - group.rotation.y) * 0.05;
      group.rotation.x += (pointer.y * 0.15 - group.rotation.x) * 0.05;
      group.position.y = scrollParallax;

      renderer.render(scene, camera);
    };

    const loop = (): void => {
      const dt = Math.min(clock.getDelta(), 0.05);
      renderFrame(dt);
      frame = requestAnimationFrame(loop);
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const start = (): void => {
      if (running || reduceMotion || this.destroyed) {
        return;
      }
      running = true;
      clock.getDelta();
      frame = requestAnimationFrame(loop);
    };
    const stop = (): void => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const resize = (): void => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!running) {
        renderFrame(0);
      }
    };

    const onPointerMove = (e: PointerEvent): void => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = (): void => {
      // Small opposite-direction offset gives a parallax feel across sections.
      scrollParallax = (window.scrollY || 0) * 0.0015;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const onVisibility = (): void => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const themeObserver = new MutationObserver(applyColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    applyColors();
    resize();
    onScroll();
    renderFrame(0);
    start();

    this.dispose = () => {
      stop();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      geometries.forEach((g) => g.dispose());
      themed.forEach(({ material }) => material.dispose());
      renderer.dispose();
    };
  }
}
