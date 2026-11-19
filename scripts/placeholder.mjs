/**
 * Astro-Integration für den Platzhalter-Modus (docs/DEPLOYMENT.md).
 * Nach dem Build bleibt in dist/ nur, was die Platzhalterseite braucht. Alle
 * übrigen Seiten wurden trotzdem gebaut und geprüft (astro check, Schemas,
 * Rendern) – sie werden nur nicht ausgeliefert. Aktiv, solange LAUNCHED = false.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Ausgelieferte Pfade relativ zu dist/. Endet ein Eintrag auf „/“, gilt er für den ganzen Ordner. */
export const PLACEHOLDER_KEEP = [
  'index.html',
  '404.html',
  'impressum/',
  'datenschutz/',
  'robots.txt',
  'sitemap.xml',
  'og/default.png',
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  'icon-512.png',
  'site.webmanifest',
  'media/brand/', // Personenbild (JSON-LD)
  'admin/', // CMS (noindex, robots-gesperrt) – Inhalte bleiben pflegbar
  '_astro/', // wird unten auf tatsächlich referenzierte Dateien reduziert
];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const isText = (f) => /\.(html|css|js|mjs|json|webmanifest|xml|svg)$/.test(f);

/** @returns {import('astro').AstroIntegration} */
export function placeholder() {
  return {
    name: 'placeholder',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const rel = (f) => path.relative(dist, f).split(path.sep).join('/');
        const keep = (r) => PLACEHOLDER_KEEP.some((k) => (k.endsWith('/') ? r.startsWith(k) : r === k));
        let removed = 0;

        for (const f of walk(dist)) {
          if (!keep(rel(f))) { fs.rmSync(f); removed++; }
        }

        // Build-Assets: nur behalten, was ausgelieferte Dateien (transitiv) referenzieren.
        const astroDir = path.join(dist, '_astro');
        if (fs.existsSync(astroDir)) {
          const assets = new Map(walk(astroDir).map((f) => [path.basename(f), f]));
          const queue = walk(dist).filter((f) => !f.startsWith(astroDir + path.sep) && isText(f));
          const used = new Set();
          while (queue.length) {
            const text = fs.readFileSync(queue.pop(), 'utf8');
            for (const [name, f] of assets) {
              if (used.has(name) || !text.includes(name)) continue;
              used.add(name);
              if (isText(f)) queue.push(f);
            }
          }
          for (const [name, f] of assets) {
            if (!used.has(name)) { fs.rmSync(f); removed++; }
          }
        }

        const pruneEmpty = (d) => {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) if (e.isDirectory()) pruneEmpty(path.join(d, e.name));
          if (d !== dist && fs.readdirSync(d).length === 0) fs.rmdirSync(d);
        };
        pruneEmpty(dist);

        logger.info(`Platzhalter-Modus (LAUNCHED = false): ${removed} Dateien nicht ausgeliefert, ${walk(dist).length} verbleiben.`);
      },
    },
  };
}
