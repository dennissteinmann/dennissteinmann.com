// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { LAUNCHED } from './src/site.config.ts';
import { placeholder } from './scripts/placeholder.mjs';

// URL-Strategie (siehe docs/SEO.md): Verzeichnis-URLs mit Slash am Ende,
// keine Dateiendungen, keine Datumsangaben im Pfad. Diese Einstellungen
// sind Teil des "URL-Vertrags" und werden nicht ohne Redirect-Plan geändert.
export default defineConfig({
  site: 'https://dennissteinmann.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  image: {
    // Responsive Bilder standardmäßig: srcset + sizes werden automatisch erzeugt.
    layout: 'constrained',
  },
  // Vor dem Livegang liefert der Build nur die Platzhalterseite aus (docs/DEPLOYMENT.md).
  integrations: [mdx(), ...(LAUNCHED ? [] : [placeholder()])],
  markdown: {
    shikiConfig: {
      theme: 'vesper',
      wrap: false,
    },
  },
});
