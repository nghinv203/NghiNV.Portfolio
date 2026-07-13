import {
  siAngular,
  siDocker,
  siDotnet,
  siElasticsearch,
  siGin,
  siGit,
  siGo,
  siJavascript,
  siOpenjdk,
  siPostgresql,
  siRabbitmq,
  siRedis,
  siTypescript,
  siVuedotjs,
} from 'simple-icons';
import type * as ThreeNS from 'three';
import type { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/** A brand logo ready to be turned into a 3D model. */
interface TechIcon {
  title: string;
  path: string;
  /** CSS hex colour (with leading #). */
  color: string;
}

/** An extruded, centred, unit-scaled 3D model of one brand logo. */
export interface TechModel {
  title: string;
  color: string;
  geometry: ThreeNS.ExtrudeGeometry;
}

const hex = (h: string): string => `#${h}`;

/**
 * The user's stack, in rough priority order. Icons whose brand no longer ships
 * a Simple Icons logo (C#, SQL Server, AWS) are represented in the Skills list
 * instead. A few near-black brand colours are overridden with their classic,
 * more legible hues so the models read on both light and dark themes.
 */
export const TECH_ICONS: TechIcon[] = [
  { title: siDotnet.title, path: siDotnet.path, color: hex(siDotnet.hex) },
  { title: siTypescript.title, path: siTypescript.path, color: hex(siTypescript.hex) },
  { title: siGo.title, path: siGo.path, color: hex(siGo.hex) },
  { title: siAngular.title, path: siAngular.path, color: '#DD0031' },
  { title: siVuedotjs.title, path: siVuedotjs.path, color: hex(siVuedotjs.hex) },
  { title: siJavascript.title, path: siJavascript.path, color: hex(siJavascript.hex) },
  { title: siDocker.title, path: siDocker.path, color: hex(siDocker.hex) },
  { title: siGit.title, path: siGit.path, color: hex(siGit.hex) },
  { title: siRedis.title, path: siRedis.path, color: hex(siRedis.hex) },
  { title: siRabbitmq.title, path: siRabbitmq.path, color: hex(siRabbitmq.hex) },
  { title: siPostgresql.title, path: siPostgresql.path, color: hex(siPostgresql.hex) },
  { title: 'Elasticsearch', path: siElasticsearch.path, color: '#00BFB3' },
  { title: siGin.title, path: siGin.path, color: hex(siGin.hex) },
  { title: 'Java', path: siOpenjdk.path, color: '#F89820' },
];

/**
 * Extrude each brand logo's SVG path into a centred, unit-sized 3D geometry.
 * three.js and the SVGLoader are passed in so the caller controls when the
 * (lazy) three chunk is loaded.
 */
export function buildTechModels(
  THREE: typeof ThreeNS,
  SVGLoaderCtor: typeof SVGLoader,
): TechModel[] {
  const loader = new SVGLoaderCtor();
  const models: TechModel[] = [];

  for (const icon of TECH_ICONS) {
    try {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.path}"/></svg>`;
      const parsed = loader.parse(svg);

      const shapes: ThreeNS.Shape[] = [];
      for (const p of parsed.paths) {
        shapes.push(...SVGLoaderCtor.createShapes(p));
      }
      if (!shapes.length) {
        continue;
      }

      const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: 6,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0.5,
        bevelSegments: 2,
        curveSegments: 8,
      });

      // SVG space is y-down; flip to three's y-up, then normalise so every
      // logo occupies roughly the same unit sphere regardless of source size.
      geometry.scale(1, -1, 1);
      geometry.center();
      geometry.computeBoundingSphere();
      const radius = geometry.boundingSphere?.radius ?? 1;
      const norm = 1 / radius;
      geometry.scale(norm, norm, norm);
      geometry.computeVertexNormals();

      models.push({ title: icon.title, color: icon.color, geometry });
    } catch {
      // A malformed path just means one fewer decorative model — never fatal.
    }
  }

  return models;
}
