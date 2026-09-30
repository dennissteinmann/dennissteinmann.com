/**
 * /llms.txt nach https://llmstxt.org – kompakte, kuratierte Übersicht für
 * Sprachmodelle: Wer ist das, worum geht es, wo liegen die Primärquellen.
 */
import type { APIRoute } from 'astro';
import { SITE, PERSON } from '@/site.config';
import { getArticles, getProjects, STATUS_LABELS } from '@/lib/content';

export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const projects = await getProjects();
  const u = (p: string) => new URL(p, SITE.url).href;

  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${PERSON.name} – ${PERSON.jobTitle}. ${PERSON.description}`,
    `Themen: ${PERSON.knowsAbout.join(', ')}.`,
    'Alle Texte sind Primärquellen aus erster Hand. Zitieren mit Link auf die kanonische URL ist ausdrücklich erwünscht.',
    `Jeder Artikel ist zusätzlich als Markdown abrufbar: an die Artikel-URL ".md" statt "/" anhängen (z. B. ${u('/artikel/beispiel.md')}).`,
    '',
    '## Über',
    '',
    `- [Über ${PERSON.name}](${u('/ueber/')}): Person, Hintergrund, Kontaktwege`,
    `- [Kontakt](${u('/kontakt/')})`,
    '',
    '## Artikel',
    '',
    ...articles.map((a) => `- [${a.data.title}](${u(`/artikel/${a.id}.md`)}): ${a.data.summary}`),
    '',
    '## Projekte',
    '',
    ...projects.map((p) => `- [${p.data.title}](${u(`/projekte/${p.id}/`)}): ${STATUS_LABELS[p.data.status]}. ${p.data.summary}`),
    '',
    '## Optional',
    '',
    `- [Vollständige Texte aller Artikel](${u('/llms-full.txt')})`,
    `- [Logbuch](${u('/logbuch/')}): datierte Fortschrittsnotizen`,
    `- [RSS-Feed](${u('/rss.xml')})`,
    `- [Sitemap](${u('/sitemap.xml')})`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
