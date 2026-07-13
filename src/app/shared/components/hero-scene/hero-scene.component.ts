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

/** One orbiting body plus its per-frame motion parameters. */
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
 * Decorative WebGL scene for the hero: a cluster of faceted crystals that
 * orbit the avatar, react to the pointer (parallax) and can be dragged to
 * spin with inertia.
 *
 * Design constraints:
 *  - Browser-only (afterNextRender) — never touches WebGL during SSR.
 *  - three.js is dynamically imported so it lands in its own lazy chunk.
 *  - Colours are read from the live CSS theme tokens and refreshed on theme
 *    change, so it matches light/dark automatically.
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
    const THREE = await import('three');
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
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 4, 5);
    const primaryLight = new THREE.PointLight(0xffffff, 18, 60, 2);
    primaryLight.position.set(-5, 2, 5);
    const accentLight = new THREE.PointLight(0xffffff, 14, 60, 2);
    accentLight.position.set(5, -3, 3);
    scene.add(ambient, keyLight, primaryLight, accentLight);

    // ── Theme colours ─────────────────────────────────────────
    const readColor = (token: string, fallback: string): ThreeNS.Color => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      return new THREE.Color(raw || fallback);
    };

    // ── Orbiting crystals ─────────────────────────────────────
    const group = new THREE.Group();
    scene.add(group);

    const geometries: ThreeNS.BufferGeometry[] = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.8, 0.32, 16, 40),
    ];
    // Tracks which theme token each material follows, so a theme switch recolours it.
    const themed: { material: ThreeNS.MeshStandardMaterial; token: 'primary' | 'accent' }[] = [];
    const bodies: OrbitBody[] = [];

    const COUNT = 8;
    for (let i = 0; i < COUNT; i++) {
      const geometry = geometries[i % geometries.length];
      const token: 'primary' | 'accent' = i % 2 === 0 ? 'primary' : 'accent';
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x000000,
        emissiveIntensity: 0.3,
        metalness: 0.4,
        roughness: 0.3,
        flatShading: true,
        wireframe: i % 4 === 3,
      });
      themed.push({ material, token });

      const mesh = new THREE.Mesh(geometry, material);
      const size = 0.32 + (i % 3) * 0.14;
      mesh.scale.setScalar(size);

      const angle = (i / COUNT) * Math.PI * 2;
      const radius = 2.3 + (i % 3) * 0.5;
      const baseY = Math.sin(i * 1.7) * 1.4;
      mesh.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
      group.add(mesh);

      bodies.push({
        mesh,
        angle,
        radius,
        baseY,
        orbitSpeed: 0.12 + (i % 4) * 0.03,
        floatSpeed: 0.6 + (i % 5) * 0.15,
        floatAmp: 0.18 + (i % 3) * 0.08,
        spinX: 0.2 + (i % 3) * 0.1,
        spinY: 0.25 + (i % 4) * 0.08,
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
      group.rotation.y = rot.y + pointer.x * 0.35 + elapsed * 0.05;
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

    const themeObserver = new MutationObserver(applyColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    applyColors();
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
      geometries.forEach((g) => g.dispose());
      themed.forEach(({ material }) => material.dispose());
      renderer.dispose();
    };
  }
}
