// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

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
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'vesper',
      wrap: false,
    },
  },
});
