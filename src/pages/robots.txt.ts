/**
 * robots.txt – Strategie (docs/SEO.md): Suchmaschinen UND KI-Crawler sind
 * ausdrücklich willkommen. Sichtbarkeit in KI-Antworten ist ein Ziel dieser
 * Seite, kein Risiko. Nur interne Hilfsseiten werden ausgeschlossen.
 */
import type { APIRoute } from 'astro';
import { SITE } from '@/site.config';

const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot',
  'Meta-ExternalAgent', 'MistralAI-User', 'CCBot',
];

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /social/', 'Disallow: /studio/',
    '',
    '# KI-Suche & Assistenten: ausdrücklich erlaubt',
    ...AI_AGENTS.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', 'Disallow: /social/', 'Disallow: /studio/', '']),
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
    `# Maschinenlesbare Übersicht: ${SITE.url}/llms.txt`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
