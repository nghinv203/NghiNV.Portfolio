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

import { buildTechModels } from '@shared/three/tech-stack.icons';

/** One orbiting tech-logo model plus its per-frame motion parameters. */
interface OrbitBody {
  mesh: ThreeNS.Mesh;
  angle: number;
  radius: number;
  baseY: number;
  orbitSpeed: number;
  floatSpeed: number;
  floatAmp: number;
  spinX: number;
  spinY: number;
}

/**
 * Decorative WebGL scene for the hero: the user's core tech-stack logos
 * (extruded to 3D) orbit the avatar, react to the pointer (parallax) and can
 * be dragged to spin with inertia.
 *
 * Design constraints:
 *  - Browser-only (afterNextRender) — never touches WebGL during SSR.
 *  - three.js is dynamically imported so it lands in its own lazy chunk.
 *  - Lights follow the CSS theme tokens; logos keep their brand colours.
 *  - Honours prefers-reduced-motion (renders a single static frame) and
 *    pauses the render loop when off-screen or the tab is hidden.
 */
@Component({
  selector: 'app-hero-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero-scene.component.html',
  styleUrl: './hero-scene.component.scss',
})
export class HeroSceneComponent {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

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
    const [THREE, { SVGLoader }] = await Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/SVGLoader.js'),
    ]);
    if (this.destroyed) {
      return;
    }

    const canvas = this.canvasRef().nativeElement;
    const host = this.host.nativeElement;

    let renderer: ThreeNS.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // No WebGL available — the scene is purely decorative, so bail quietly.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 12);

    // ── Lighting ──────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 4, 5);
    const primaryLight = new THREE.PointLight(0xffffff, 18, 60, 2);
    primaryLight.position.set(-5, 2, 5);
    const accentLight = new THREE.PointLight(0xffffff, 14, 60, 2);
    accentLight.position.set(5, -3, 3);
    scene.add(ambient, keyLight, primaryLight, accentLight);

    const readColor = (token: string, fallback: string): ThreeNS.Color => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      return new THREE.Color(raw || fallback);
    };

    // ── Orbiting tech-logo models ─────────────────────────────
    const group = new THREE.Group();
    scene.add(group);

    const models = buildTechModels(THREE, SVGLoader);
    if (!models.length) {
      renderer.dispose();
      return;
    }
    const materials = models.map(
      (m) =>
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(m.color),
          emissive: new THREE.Color(m.color),
          emissiveIntensity: 0.16,
          metalness: 0.45,
          roughness: 0.4,
          side: THREE.DoubleSide,
        }),
    );

    const bodies: OrbitBody[] = [];
    const COUNT = Math.min(9, models.length);

    for (let i = 0; i < COUNT; i++) {
      const mesh = new THREE.Mesh(models[i].geometry, materials[i]);
      const size = 0.55 + (i % 3) * 0.16;
      mesh.scale.setScalar(size);

      const angle = (i / COUNT) * Math.PI * 2;
      const radius = 2.4 + (i % 3) * 0.5;
      const baseY = Math.sin(i * 1.7) * 1.3;
      mesh.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
      group.add(mesh);

      bodies.push({
        mesh,
        angle,
        radius,
        baseY,
        orbitSpeed: 0.22 + (i % 4) * 0.06,
        floatSpeed: 0.8 + (i % 5) * 0.2,
        floatAmp: 0.26 + (i % 3) * 0.1,
        spinX: 0.3 + (i % 3) * 0.12,
        spinY: 0.4 + (i % 4) * 0.12,
      });
    }

    const applyLights = (): void => {
      primaryLight.color.copy(readColor('--color-primary', '#4f46e5'));
      accentLight.color.copy(readColor('--color-accent', '#0891b2'));
      if (!running) {
        renderFrame(0);
      }
    };

    // ── Interaction state ─────────────────────────────────────
    const pointer = { x: 0, y: 0 };
    const rot = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const clock = new THREE.Clock();
    let elapsed = 0;
    let running = false;
    let frame = 0;

    const renderFrame = (dt: number): void => {
      elapsed += dt;
      for (const b of bodies) {
        b.angle += b.orbitSpeed * dt;
        b.mesh.position.x = Math.cos(b.angle) * b.radius;
        b.mesh.position.z = Math.sin(b.angle) * b.radius;
        b.mesh.position.y = b.baseY + Math.sin(elapsed * b.floatSpeed) * b.floatAmp;
        b.mesh.rotation.x += b.spinX * dt;
        b.mesh.rotation.y += b.spinY * dt;
      }

      // Drag inertia decays toward rest; pointer adds a gentle parallax tilt.
      rot.y += vel.y;
      rot.x += vel.x;
      vel.x *= 0.92;
      vel.y *= 0.92;
      group.rotation.y = rot.y + pointer.x * 0.35 + elapsed * 0.1;
      group.rotation.x = THREE.MathUtils.clamp(rot.x + pointer.y * 0.2, -0.8, 0.8);

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
      clock.getDelta(); // discard the gap accumulated while paused
      frame = requestAnimationFrame(loop);
    };
    const stop = (): void => {
      running = false;
      cancelAnimationFrame(frame);
    };

    // ── Sizing ────────────────────────────────────────────────
    const resize = (): void => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!running) {
        renderFrame(0);
      }
    };

    // ── Pointer handlers ──────────────────────────────────────
    const updateParallax = (e: PointerEvent): void => {
      const r = host.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onPointerDown = (e: PointerEvent): void => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      try {
        host.setPointerCapture(e.pointerId);
      } catch {
        /* capture unsupported — dragging still works via window fallback */
      }
    };
    const onPointerMove = (e: PointerEvent): void => {
      updateParallax(e);
      if (!dragging) {
        return;
      }
      vel.y = (e.clientX - lastX) * 0.006;
      vel.x = (e.clientY - lastY) * 0.006;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerUp = (e: PointerEvent): void => {
      dragging = false;
      try {
        host.releasePointerCapture(e.pointerId);
      } catch {
        /* nothing captured */
      }
    };

    host.addEventListener('pointerdown', onPointerDown);
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerup', onPointerUp);
    host.addEventListener('pointerleave', onPointerUp);

    // ── Lifecycle observers ───────────────────────────────────
    const io = new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? start() : stop()),
      { threshold: 0.05 },
    );
    io.observe(host);

    const ro = new ResizeObserver(() => resize());
    ro.observe(host);

    const onVisibility = (): void => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const themeObserver = new MutationObserver(applyLights);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    applyLights();
    resize();
    renderFrame(0); // paint one frame immediately; IntersectionObserver starts the loop

    this.dispose = () => {
      stop();
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerup', onPointerUp);
      host.removeEventListener('pointerleave', onPointerUp);
      models.forEach((m) => m.geometry.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }
}
