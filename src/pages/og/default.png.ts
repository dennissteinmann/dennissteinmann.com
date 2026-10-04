import type { APIRoute } from 'astro';
import { SITE } from '@/site.config';
import { ogTemplate, renderPng, pngResponse } from '@/lib/og';

export const GET: APIRoute = async () => pngResponse(await renderPng(ogTemplate({ title: SITE.statement, meta: 'Explorationen · Projekte · Medien' }), 1200, 630));
