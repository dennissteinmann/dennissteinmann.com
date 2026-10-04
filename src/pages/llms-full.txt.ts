import type { APIRoute } from 'astro';
import { SITE, PERSON } from '@/site.config';
import { getExplorations, cleanBody, isoDate } from '@/lib/content';

export const GET: APIRoute = async () => {
  const parts = (await getExplorations()).filter((e) => !e.data.draft).map((e) =>
    [
      `# ${e.data.title}`,
      '',
      `URL: ${SITE.url}/explorationen/${e.id}/`,
      `Autor: ${PERSON.name} · Veröffentlicht: ${isoDate(e.data.pubDate)}${e.data.updated ? ` · Aktualisiert: ${isoDate(e.data.updated)}` : ''}`,
      '',
      `> ${e.data.summary}`,
      '',
      cleanBody(e.body),
    ].join('\n'),
  );
  const body = [`# ${SITE.name} – alle Explorationen im Volltext`, '', `> ${PERSON.description}`, '', ...parts].join('\n\n---\n\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
