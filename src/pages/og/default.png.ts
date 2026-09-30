import type { APIRoute } from 'astro';
import { SITE } from '@/site.config';
import { ogTemplate, renderPng, pngResponse } from '@/lib/og';

export const GET: APIRoute = async () =>
  pngResponse(await renderPng(ogTemplate({ kicker: 'Build in Public', title: `${SITE.name} – ${SITE.tagline}`, meta: 'Artikel · Projekte · Logbuch' }), 1200, 630));
