import type { APIRoute } from 'astro';
import { SITE } from '@/site.config';
import { getIndexableUrls } from '@/lib/urls';

export const GET: APIRoute = async () => {
  const urls = await getIndexableUrls();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${new URL(u.path, SITE.url).href}</loc>${u.lastmod ? `<lastmod>${u.lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
