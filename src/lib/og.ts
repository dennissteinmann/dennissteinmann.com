/**
 * Bildgenerator für OG-Bilder (1200×630) und Social-Carousels (1080×1350).
 * satori → SVG → resvg → PNG, zur Build-Zeit. Gleiche Haltung wie die
 * Website (v5 „Weißes Kontor“): Jost (geometrische Grotesk), Weiß, Marineblau,
 * Messing, gesperrte Versalien, Wappen. Rechtwinklig, ohne Verläufe. Siehe docs/SOCIAL.md.
 */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import crestSvg from '@/assets/brand/crest.svg?raw';

const require = createRequire(import.meta.url);

/** Spiegel von tokens.css (satori kennt keine CSS-Variablen). */
export const C = {
  white: '#ffffff', paper: '#ffffff', ink: '#14181f', inkSoft: '#3a3f48', grey: '#62666d', line: '#e3e5e8',
  navy: '#152238', brass: '#7d5f33', brassLight: '#c2a36b', ivory: '#fafafa', ivoryMuted: '#b2b5ba',
};

type Font = { name: string; data: Buffer; weight: 300 | 400 | 500; style: 'normal' | 'italic' };
let cache: Font[] | null = null;
async function loadFonts(): Promise<Font[]> {
  if (cache) return cache;
  const f = (p: string) => fs.readFile(require.resolve(p));
  cache = [
    { name: 'Jost', data: await f('@fontsource/jost/files/jost-latin-300-normal.woff'), weight: 300, style: 'normal' },
    { name: 'Jost', data: await f('@fontsource/jost/files/jost-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Jost', data: await f('@fontsource/jost/files/jost-latin-500-normal.woff'), weight: 500, style: 'normal' },
  ];
  return cache;
}

type Child = Node | string | null | false | undefined;
type Node = { type: string; props: Record<string, unknown> };
export function h(type: string, style: Record<string, unknown> = {}, ...children: Child[]): Node {
  const kids = children.filter((c) => c !== null && c !== false && c !== undefined);
  return { type, props: { style: { display: 'flex', ...style }, children: kids.length === 1 ? kids[0] : kids } };
}

export async function renderPng(node: Node, width: number, height: number): Promise<Uint8Array> {
  const svg = await satori(node as never, { width, height, fonts: await loadFonts() });
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng());
}
export const pngResponse = (png: Uint8Array) =>
  new Response(png as unknown as BodyInit, { headers: { 'Content-Type': 'image/png' } });
export const fit = (text: string, sizes: [number, number][]) => sizes.find(([max]) => text.length <= max)?.[1] ?? sizes.at(-1)![1];

/* Bausteine ----------------------------------------------------------------- */

/** Das Wappen als Bild in beliebiger Farbe (Seitenverhältnis 28:36). */
const crest = (color: string, height: number): Node => ({
  type: 'img',
  props: {
    src: `data:image/svg+xml;base64,${Buffer.from(crestSvg.replace('fill="currentColor"', `fill="${color}"`)).toString('base64')}`,
    width: Math.round(height * 0.78), height, style: {},
  },
});
/** Wortmarke: Garamond-Versalien, gesperrt – wie auf der Website. */
const wordmark = (color: string, size: number) =>
  h('div', { fontFamily: 'Jost', fontWeight: 500, fontSize: size, letterSpacing: size * 0.18, textTransform: 'uppercase', color }, 'Dennis Steinmann');
/** Etikett: kleine, gesperrte Grotesk-Versalien. */
const label = (text: string, color: string, size: number) =>
  h('div', { fontFamily: 'Jost', fontWeight: 500, fontSize: size, letterSpacing: size * 0.16, textTransform: 'uppercase', color }, text);
/** Zierlinie wie im Briefkopf: kräftig über fein. */
const doubleRule = (color: string) =>
  h('div', { width: '100%', height: 6, borderTop: `2px solid ${color}`, borderBottom: `1px solid ${color}` });

/* Vorlagen ---------------------------------------------------------------- */

export function ogTemplate(o: { title: string; meta: string }) {
  const size = fit(o.title, [[30, 84], [55, 70], [80, 60], [999, 52]]);
  return h('div', { width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 80px', backgroundColor: C.navy, color: C.ivory },
    h('div', { flexDirection: 'column', gap: 26 },
      h('div', { justifyContent: 'space-between', alignItems: 'center' },
        h('div', { alignItems: 'center', gap: 22 }, crest(C.brassLight, 58), wordmark(C.ivory, 24)),
        label(o.meta, C.ivoryMuted, 15),
      ),
      doubleRule(C.ivory),
    ),
    h('div', { fontFamily: 'Jost', fontSize: size, lineHeight: 1.08, maxWidth: 980 }, o.title),
    h('div', { flexDirection: 'column', gap: 20 },
      h('div', { width: 72, height: 2, backgroundColor: C.brassLight }),
      label('dennissteinmann.com', C.ivoryMuted, 15),
    ),
  );
}

export function slideTemplate(o: { kind: 'cover' | 'content' | 'cta'; index: number; total: number; title?: string; text?: string; url?: string }) {
  const counter = `${o.index} / ${o.total}`;
  const dark = o.kind === 'cta';
  const fg = dark ? C.ivory : C.ink;
  const muted = dark ? C.ivoryMuted : C.grey;
  const accent = dark ? C.brassLight : C.brass;
  const top = h('div', { flexDirection: 'column', gap: 30 },
    h('div', { justifyContent: 'space-between', alignItems: 'center' },
      h('div', { alignItems: 'center', gap: 22 }, crest(dark ? C.brassLight : C.navy, 54), wordmark(fg, 24)),
      label(counter, muted, 20),
    ),
    doubleRule(fg),
  );
  const base = { width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: '84px 92px', backgroundColor: dark ? C.navy : C.paper, color: fg };
  const foot = (text: string) => h('div', { flexDirection: 'column', gap: 22 },
    h('div', { width: 80, height: 2, backgroundColor: accent }), label(text, muted, 20));

  if (o.kind === 'cover') {
    const size = fit(o.title ?? '', [[30, 112], [55, 94], [80, 80], [999, 68]]);
    return h('div', base, top,
      h('div', { fontFamily: 'Jost', fontSize: size, lineHeight: 1.04, letterSpacing: -1 }, o.title ?? ''),
      foot('Eine Exploration von Dennis Steinmann'),
    );
  }
  if (o.kind === 'cta') {
    return h('div', base, top,
      h('div', { flexDirection: 'column', gap: 36 },
        h('div', { fontFamily: 'Jost', fontWeight: 300, fontSize: 92, lineHeight: 1.04, letterSpacing: -1 }, o.title ?? 'Weiterdenken'),
        o.text ? h('div', { fontFamily: 'Jost', fontSize: 38, lineHeight: 1.35, maxWidth: 820 }, o.text) : null,
      ),
      foot(o.url ?? 'dennissteinmann.com'),
    );
  }
  const textSize = fit(o.text ?? '', [[90, 60], [160, 50], [999, 42]]);
  return h('div', base, top,
    h('div', { flexDirection: 'column', gap: 36 },
      o.title ? h('div', { fontFamily: 'Jost', fontSize: fit(o.title, [[24, 84], [45, 70], [999, 58]]), lineHeight: 1.06, letterSpacing: -0.5 }, o.title) : null,
      o.text ? h('div', { fontFamily: 'Jost', fontWeight: o.title ? 400 : 300, fontSize: o.title ? 40 : textSize, lineHeight: 1.3, color: o.title ? C.inkSoft : C.ink }, o.text) : null,
    ),
    foot('dennissteinmann.com'),
  );
}
