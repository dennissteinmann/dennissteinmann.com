#!/usr/bin/env node
/**
 * SEO-Smoke-Test über den fertigen Build (dist/). Läuft in CI vor jedem
 * Deploy und lokal mit `npm run check:seo`. Bricht bei Fehlern ab.
 *
 * Prüft je HTML-Seite: <title>, Meta-Description, Canonical, genau eine <h1>,
 * lang-Attribut, OG-Bild, alt-Texte, JSON-LD parsebar, interne Links auflösbar.
 * Prüft global: jede Sitemap-URL existiert und ist nicht noindex.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '..', 'dist');
const SITE = 'https://dennissteinmann.com';
const errors = [];
const warn = [];

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const exists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return fs.existsSync(path.join(DIST, 'index.html'));
  const p = path.join(DIST, clean);
  return (fs.existsSync(p) && fs.statSync(p).isFile()) || fs.existsSync(path.join(p, 'index.html'));
};
const toPath = (file) => '/' + path.relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const page = toPath(file);
  if (page === '/404.html') continue;
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const e = (msg) => errors.push(`${page}: ${msg}`);

  if (!/<html lang="de"/.test(html)) e('lang="de" fehlt');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) e('<title> fehlt');
  else if (title.length > 90 && !noindex) warn.push(`${page}: <title> ist ${title.length} Zeichen lang`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) e('Meta-Description fehlt');
  if (!/<link rel="canonical" href="https:\/\/dennissteinmann\.com\/[^"]*"/.test(html)) e('Canonical fehlt/falsch');
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) e(`${h1}× <h1> (erwartet: genau 1)`);
  if (!/<meta property="og:image" content="https:/.test(html)) e('og:image fehlt');

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\balt(="|[\s>\/])/.test(img)) e(`Bild ohne alt: ${img.slice(0, 80)}`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { e('JSON-LD nicht parsebar'); }
  }

  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    let href = m[1];
    if (href.startsWith(SITE)) href = href.slice(SITE.length);
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (!exists(href)) e(`Toter interner Link: ${href}`);
    else if (!href.includes('.') && !href.split('#')[0].endsWith('/')) e(`Link ohne Slash am Ende: ${href}`);
  }
}

// Sitemap ↔ Seiten
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const p = loc.replace(SITE, '');
  if (!exists(p)) { errors.push(`sitemap.xml: ${loc} existiert nicht`); continue; }
  const html = fs.readFileSync(path.join(DIST, p, 'index.html'), 'utf8');
  if (/<meta name="robots" content="noindex/.test(html)) errors.push(`sitemap.xml: ${loc} ist noindex`);
}
for (const f of ['robots.txt', 'llms.txt', 'llms-full.txt', 'rss.xml', 'og/default.png']) {
  if (!fs.existsSync(path.join(DIST, f))) errors.push(`${f} fehlt`);
}

warn.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((x) => console.error(`✗ ${x}`));
  console.error(`\n${errors.length} Fehler in ${htmlFiles.length} Seiten.`);
  process.exit(1);
}
console.log(`✓ SEO-Check bestanden: ${htmlFiles.length} Seiten, Sitemap konsistent.`);
