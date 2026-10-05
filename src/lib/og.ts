/**
 * Bildgenerator für OG-Bilder (1200×630) und Social-Carousels (1080×1350).
 * satori → SVG → resvg → PNG, zur Build-Zeit. Gleiche Haltung wie die
 * Website: Weiß, Schwarz, Serif, viel Raum. Siehe docs/SOCIAL.md.
 */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);

/** Spiegel von tokens.css (satori kennt keine CSS-Variablen). Warm, „Anthropic“. */
export const C = { white: '#ffffff', bone: '#f5f3ec', ink: '#1a1711', grey: '#8c8578', line: '#e4ddce', clay: '#be5b3e', walnut: '#4a2a1d', cream: '#f3eee3' };

type Font = { name: string; data: Buffer; weight: 400 | 500; style: 'normal' | 'italic' };
let cache: Font[] | null = null;
async function loadFonts(): Promise<Font[]> {
  if (cache) return cache;
  const f = (p: string) => fs.readFile(require.resolve(p));
  cache = [
    { name: 'Serif', data: await f('@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Serif', data: await f('@fontsource/eb-garamond/files/eb-garamond-latin-400-italic.woff'), weight: 400, style: 'italic' },
    { name: 'Sans', data: await f('@fontsource/archivo/files/archivo-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Sans', data: await f('@fontsource/archivo/files/archivo-latin-500-normal.woff'), weight: 500, style: 'normal' },
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

/* Vorlagen ---------------------------------------------------------------- */

export function ogTemplate(o: { title: string; meta: string }) {
  const size = fit(o.title, [[30, 92], [55, 76], [80, 64], [999, 54]]);
  return h('div', { width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 80px', backgroundColor: C.bone, color: C.ink },
    h('div', { justifyContent: 'space-between', fontFamily: 'Sans', fontSize: 22, color: C.ink },
      h('div', {}, 'Dennis Steinmann'),
      h('div', { color: C.grey }, o.meta),
    ),
    h('div', { fontFamily: 'Serif', fontSize: size, lineHeight: 1.04, letterSpacing: -1, maxWidth: 980 }, o.title),
    h('div', { fontFamily: 'Sans', fontSize: 20, color: C.grey }, 'dennissteinmann.com'),
  );
}

export function slideTemplate(o: { kind: 'cover' | 'content' | 'cta'; index: number; total: number; title?: string; text?: string; url?: string }) {
  const counter = `${o.index} / ${o.total}`;
  const dark = o.kind === 'cta';
  const fg = dark ? C.cream : C.ink;
  const muted = dark ? 'rgba(239,233,223,0.6)' : C.grey;
  const top = h('div', { justifyContent: 'space-between', fontFamily: 'Sans', fontSize: 26, color: fg },
    h('div', {}, 'Dennis Steinmann'), h('div', { color: muted }, counter));
  const base = { width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: '88px 92px', backgroundColor: dark ? C.walnut : C.bone, color: fg };

  if (o.kind === 'cover') {
    const size = fit(o.title ?? '', [[30, 120], [55, 100], [80, 86], [999, 72]]);
    return h('div', base, top,
      h('div', { fontFamily: 'Serif', fontSize: size, lineHeight: 1.0, letterSpacing: -2 }, o.title ?? ''),
      h('div', { fontFamily: 'Sans', fontSize: 24, color: muted }, 'Eine Exploration von Dennis Steinmann'),
    );
  }
  if (o.kind === 'cta') {
    return h('div', base, top,
      h('div', { flexDirection: 'column', gap: 36 },
        h('div', { fontFamily: 'Serif', fontStyle: 'italic', fontSize: 96, lineHeight: 1.0, letterSpacing: -1.5 }, o.title ?? 'Weiterdenken'),
        o.text ? h('div', { fontFamily: 'Serif', fontSize: 38, lineHeight: 1.35, maxWidth: 820 }, o.text) : null,
      ),
      h('div', { fontFamily: 'Sans', fontSize: 26, color: muted }, o.url ?? 'dennissteinmann.com'),
    );
  }
  const textSize = fit(o.text ?? '', [[90, 60], [160, 50], [999, 42]]);
  return h('div', base, top,
    h('div', { flexDirection: 'column', gap: 36 },
      o.title ? h('div', { fontFamily: 'Serif', fontSize: fit(o.title, [[24, 84], [45, 70], [999, 58]]), lineHeight: 1.04, letterSpacing: -1 }, o.title) : null,
      o.text ? h('div', { fontFamily: 'Serif', fontStyle: o.title ? 'normal' : 'italic', fontSize: o.title ? 40 : textSize, lineHeight: 1.3, color: o.title ? '#3b3b3b' : C.ink }, o.text) : null,
    ),
    h('div', { fontFamily: 'Sans', fontSize: 24, color: muted }, 'dennissteinmann.com'),
  );
}
