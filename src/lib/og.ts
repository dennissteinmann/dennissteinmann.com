/**
 * Bildgenerator für OG-Bilder (1200×630) und Social-Carousels (1080×1350).
 * Läuft zur Build-Zeit (satori → SVG → resvg → PNG). Nutzt dieselben
 * Farben & Schriften wie die Website – Social-Grafiken sind Teil des
 * Designsystems, nicht davon losgelöst. Siehe docs/SOCIAL.md.
 */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import crestSvg from '@/assets/brand/crest.svg?raw';

const require = createRequire(import.meta.url);

/** Spiegel der Rohpalette aus tokens.css (satori kann keine CSS-Variablen). */
export const C = {
  ink: '#0b0b0a',
  ink2: '#191916',
  paper: '#f3efe6',
  stone: '#8f897e',
  signal: '#ec4a2a',
  lime: '#d8f36a',
  gold: '#e2b25a',
  line: 'rgba(243,239,230,0.16)',
  lineDark: 'rgba(11,11,10,0.14)',
};

type Font = { name: string; data: Buffer; weight: 400 | 500 | 800; style: 'normal' | 'italic' };
let fontsCache: Font[] | null = null;

async function loadFonts(): Promise<Font[]> {
  if (fontsCache) return fontsCache;
  const f = (p: string) => fs.readFile(require.resolve(p));
  fontsCache = [
    { name: 'Serif', data: await f('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Serif', data: await f('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff'), weight: 400, style: 'italic' },
    { name: 'Sans', data: await f('@fontsource/inter-tight/files/inter-tight-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Sans', data: await f('@fontsource/inter-tight/files/inter-tight-latin-800-normal.woff'), weight: 800, style: 'normal' },
    { name: 'Mono', data: await f('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff'), weight: 500, style: 'normal' },
    // Kyrillisches Subset enthält das Nummernzeichen №
    { name: 'Mono', data: await f('@fontsource/jetbrains-mono/files/jetbrains-mono-cyrillic-500-normal.woff'), weight: 500, style: 'normal' },
  ];
  return fontsCache;
}

export const crestDataUri = (color: string) =>
  `data:image/svg+xml;base64,${Buffer.from(crestSvg.replace('fill="currentColor"', `fill="${color}"`)).toString('base64')}`;

/** Minimaler Hyperscript-Helper für satori (kein React nötig). */
type Child = Node | string | null | false | undefined;
type Node = { type: string; props: Record<string, unknown> };
export function h(type: string, style: Record<string, unknown> = {}, ...children: Child[]): Node {
  const kids = children.filter((c) => c !== null && c !== false && c !== undefined);
  return { type, props: { style: { display: 'flex', ...style }, children: kids.length === 1 ? kids[0] : kids } };
}
export const img = (src: string, style: Record<string, unknown>) => ({ type: 'img', props: { src, style } });

export async function renderPng(node: Node, width: number, height: number): Promise<Uint8Array> {
  const svg = await satori(node as never, { width, height, fonts: await loadFonts() });
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng());
}

export const pngResponse = (png: Uint8Array) =>
  new Response(png as unknown as BodyInit, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });

/** Schriftgröße grob an Textlänge anpassen, damit nichts überläuft. */
export const fit = (text: string, sizes: [number, number][]) => sizes.find(([max]) => text.length <= max)?.[1] ?? sizes.at(-1)![1];

/* ------------------------------------------------------------------------ */
/* Vorlagen                                                                  */
/* ------------------------------------------------------------------------ */

export function ogTemplate(o: { kicker: string; title: string; meta: string; italicTail?: boolean }) {
  const titleSize = fit(o.title, [[28, 96], [48, 80], [70, 66], [999, 56]]);
  return h(
    'div',
    { width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', backgroundColor: C.ink, backgroundImage: `radial-gradient(circle at 88% 120%, rgba(226,178,90,0.45), rgba(236,74,42,0.12) 35%, rgba(11,11,10,0) 62%)`, color: C.paper, fontFamily: 'Sans' },
    h('div', { alignItems: 'center', justifyContent: 'space-between' },
      h('div', { alignItems: 'center', gap: 18 },
        img(crestDataUri(C.paper), { width: 44, height: 57 }),
        h('div', { flexDirection: 'column', gap: 4 },
          h('div', { fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }, 'STEINMANN'),
          h('div', { fontFamily: 'Mono', fontSize: 13, letterSpacing: 3, color: C.stone }, 'GRADATIM FEROCITER'),
        ),
      ),
      h('div', { fontFamily: 'Mono', fontSize: 18, color: C.signal, letterSpacing: 2 }, o.kicker.toUpperCase()),
    ),
    h('div', { fontFamily: 'Serif', fontSize: titleSize, lineHeight: 1.02, letterSpacing: -1, maxWidth: 1000 }, o.title),
    h('div', { justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.line}`, paddingTop: 22, fontFamily: 'Mono', fontSize: 18, color: C.stone, letterSpacing: 1 },
      h('div', {}, o.meta.toUpperCase()),
      h('div', { color: C.paper }, 'dennissteinmann.com'),
    ),
  );
}

type SlideKind = 'cover' | 'content' | 'cta';
export function slideTemplate(o: { kind: SlideKind; index: number; total: number; number?: string; title?: string; text?: string; url?: string }) {
  const counter = `${String(o.index).padStart(2, '0')} / ${String(o.total).padStart(2, '0')}`;
  const base = { width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', padding: '80px 84px', fontFamily: 'Sans' };

  const brandRow = (color: string, muted: string) =>
    h('div', { justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Mono', fontSize: 22, letterSpacing: 2, color: muted },
      h('div', { alignItems: 'center', gap: 16, color },
        img(crestDataUri(color), { width: 34, height: 44 }),
        h('div', { fontFamily: 'Sans', fontWeight: 800, fontSize: 26, letterSpacing: -0.5 }, 'STEINMANN'),
      ),
      h('div', {}, counter),
    );

  if (o.kind === 'cover') {
    const size = fit(o.title ?? '', [[30, 128], [55, 104], [80, 88], [999, 74]]);
    return h('div', { ...base, backgroundColor: C.ink, color: C.paper, backgroundImage: `radial-gradient(circle at 80% 105%, rgba(226,178,90,0.5), rgba(236,74,42,0.15) 38%, rgba(11,11,10,0) 65%)` },
      brandRow(C.paper, C.stone),
      h('div', { flexDirection: 'column', gap: 36 },
        o.number ? h('div', { fontFamily: 'Mono', fontSize: 26, color: C.signal, letterSpacing: 3 }, `${o.number} · ARTIKEL`) : null,
        h('div', { fontFamily: 'Serif', fontSize: size, lineHeight: 0.98, letterSpacing: -2 }, o.title ?? ''),
      ),
      h('div', { justifyContent: 'space-between', borderTop: `1px solid ${C.line}`, paddingTop: 28, fontFamily: 'Mono', fontSize: 24, color: C.stone, letterSpacing: 2 },
        h('div', {}, 'DENNIS STEINMANN'),
        h('div', { color: C.lime }, 'SWIPE »'),
      ),
    );
  }

  if (o.kind === 'cta') {
    return h('div', { ...base, backgroundColor: C.signal, color: C.ink },
      brandRow(C.ink, 'rgba(11,11,10,0.6)'),
      h('div', { flexDirection: 'column', gap: 40 },
        h('div', { fontFamily: 'Serif', fontSize: 104, lineHeight: 0.98, letterSpacing: -2 }, o.title ?? 'Der ganze Artikel'),
        o.text ? h('div', { fontSize: 36, lineHeight: 1.35, maxWidth: 820 }, o.text) : null,
      ),
      h('div', { flexDirection: 'column', gap: 12, borderTop: `1px solid ${C.lineDark}`, paddingTop: 28, fontFamily: 'Mono', fontSize: 26, letterSpacing: 1 },
        h('div', { opacity: 0.6 }, 'LINK IN DEN KOMMENTAREN / BIO'),
        h('div', {}, o.url ?? 'dennissteinmann.com'),
      ),
    );
  }

  const titleSize = fit(o.title ?? '', [[24, 84], [45, 72], [999, 60]]);
  const textSize = fit(o.text ?? '', [[90, 46], [160, 40], [999, 34]]);
  return h('div', { ...base, backgroundColor: C.paper, color: C.ink },
    brandRow(C.ink, C.stone),
    h('div', { flexDirection: 'column', gap: 40 },
      h('div', { fontFamily: 'Mono', fontSize: 120, color: C.signal, lineHeight: 1, letterSpacing: -4 }, String(o.index - 1).padStart(2, '0')),
      o.title ? h('div', { fontFamily: 'Serif', fontSize: titleSize, lineHeight: 1.02, letterSpacing: -1.5 }, o.title) : null,
      o.text ? h('div', { fontSize: o.title ? 36 : textSize, lineHeight: 1.38, fontWeight: o.title ? 500 : 800, letterSpacing: o.title ? 0 : -0.5 }, o.text) : null,
    ),
    h('div', { justifyContent: 'space-between', borderTop: `1px solid ${C.lineDark}`, paddingTop: 28, fontFamily: 'Mono', fontSize: 22, color: C.stone, letterSpacing: 2 },
      h('div', {}, 'DENNISSTEINMANN.COM'),
      h('div', {}, '»'),
    ),
  );
}
