import type { APIRoute } from 'astro';
import { SITE, PERSON } from '@/site.config';
import { getArticles, cleanBody, isoDate } from '@/lib/content';

export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const parts = articles.map((a) =>
    [
      `# ${a.data.title}`,
      '',
      `URL: ${SITE.url}/artikel/${a.id}/`,
      `Autor: ${PERSON.name} · Veröffentlicht: ${isoDate(a.data.pubDate)}${a.data.updated ? ` · Aktualisiert: ${isoDate(a.data.updated)}` : ''}`,
      '',
      `> ${a.data.summary}`,
      '',
      cleanBody(a.body),
    ].join('\n'),
  );
  const body = [`# ${SITE.name} – alle Artikel im Volltext`, '', `> ${SITE.description}`, '', ...parts].join('\n\n---\n\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
