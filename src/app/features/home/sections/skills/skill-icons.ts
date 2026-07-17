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

export interface SkillIcon {
  /** SVG path data (24×24 viewBox). May contain several subpaths. */
  path: string;
  /** CSS hex colour (with leading #). */
  color: string;
  /** 'fill' (default, brand logos) or 'stroke' (line-drawn concept icons). */
  mode?: 'fill' | 'stroke';
}

const hex = (h: string): string => `#${h}`;
const brand = (icon: { path: string; hex: string }, color?: string): SkillIcon => ({
  path: icon.path,
  color: color ?? hex(icon.hex),
});

// Original, simple line icons for skills that have no brand logo (removed from
// Simple Icons for trademark reasons) or that are concepts, not products.
const CUSTOM = {
  // "C#": a C with a sharp sign.
  csharp: {
    mode: 'stroke',
    color: '#9B4F96',
    path: 'M13 9 a4 4 0 1 0 0 6 M16 9.5 v6 M18.5 9.5 v6 M15.2 11.5 h4.8 M15.2 13.7 h4.8',
  },
  // Database cylinder (colour overridden per database below).
  database: {
    mode: 'stroke',
    color: '#4479A1',
    path: 'M5 6 a7 3 0 1 0 14 0 a7 3 0 1 0 -14 0 M5 6 V18 a7 3 0 0 0 14 0 V6',
  },
  // Stacked layers (ORM / data mapping).
  layers: {
    mode: 'stroke',
    color: '#512BD4',
    path: 'M12 3 L21 8 L12 13 L3 8 Z M3 12 L12 17 L21 12 M3 16 L12 21 L21 16',
  },
  // Broadcast waves (real-time).
  broadcast: {
    mode: 'stroke',
    color: '#0EA5E9',
    path: 'M12 16.5 a1.3 1.3 0 1 0 0.01 0 Z M8.6 14 a5 5 0 0 1 6.8 0 M6.1 11.5 a8.5 8.5 0 0 1 11.8 0',
  },
  // Cloud (storage / AWS).
  cloud: {
    mode: 'fill',
    color: '#FF9900',
    path: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
  },
  // Concentric rings (Clean Architecture).
  rings: {
    mode: 'stroke',
    color: '#0891B2',
    path: 'M12 3 a9 9 0 1 0 0.01 0 Z M12 7 a5 5 0 1 0 0.01 0 Z M12 10.5 a1.5 1.5 0 1 0 0.01 0 Z',
  },
  // Modular blocks (SOLID principles).
  blocks: {
    mode: 'stroke',
    color: '#6366F1',
    path: 'M4 4 h6 v6 h-6 z M14 4 h6 v6 h-6 z M4 14 h6 v6 h-6 z M14 14 h6 v6 h-6 z',
  },
} satisfies Record<string, SkillIcon>;

/**
 * Maps a skill id (see mock/data/skills.data.ts) to its icon. Brand logos come
 * from Simple Icons; the rest use the hand-drawn line icons above. A few
 * near-black brand hues are overridden so they read on both themes.
 */
export const SKILL_ICONS: Record<string, SkillIcon> = {
  // Brand logos.
  ts: brand(siTypescript),
  js: brand(siJavascript),
  go: brand(siGo),
  java: brand(siOpenjdk, '#F89820'),
  dotnet: brand(siDotnet),
  angular: brand(siAngular, '#DD0031'),
  vue: brand(siVuedotjs),
  gin: brand(siGin),
  git: brand(siGit),
  docker: brand(siDocker),
  redis: brand(siRedis),
  rabbitmq: brand(siRabbitmq),
  elastic: brand(siElasticsearch, '#00BFB3'),
  postgres: brand(siPostgresql),

  // Hand-drawn icons.
  csharp: CUSTOM.csharp,
  sql: { ...CUSTOM.database, color: '#4479A1' },
  sqlserver: { ...CUSTOM.database, color: '#CC2927' },
  efcore: CUSTOM.layers,
  signalr: CUSTOM.broadcast,
  aws: CUSTOM.cloud,
  'clean-arch': CUSTOM.rings,
  solid: CUSTOM.blocks,
};
