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

/** A brand logo (24×24 SVG path) shown on the hero's clay chips. */
export interface TechIcon {
  title: string;
  path: string;
  /** CSS hex colour (with leading #). */
  color: string;
}

const hex = (h: string): string => `#${h}`;

/**
 * The user's stack, in rough priority order. Icons whose brand no longer ships
 * a Simple Icons logo (C#, SQL Server, AWS) are represented in the Skills list
 * instead. A few near-black brand colours are overridden with their classic,
 * more legible hues so the logos read on both light and dark themes.
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
