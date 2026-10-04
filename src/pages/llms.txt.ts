/**
 * /llms.txt nach https://llmstxt.org – kuratierte Übersicht für Sprachmodelle:
 * Wer ist das, wofür ist er Experte (mit Position), wo liegen die Primärquellen.
 * Bewusst faktisch – keine Anweisungen an Modelle.
 */
import type { APIRoute } from 'astro';
import { SITE, PERSON, activeChannels } from '@/site.config';
import { getExplorations, getProjects, getTopics, getPress, PROJECT_KIND_LABELS, STATUS_LABELS, isoDate } from '@/lib/content';

export const GET: APIRoute = async () => {
  const u = (p: string) => new URL(p, SITE.url).href;
  const explorations = (await getExplorations()).filter((e) => !e.data.draft);
  const projects = (await getProjects()).filter((p) => !p.data.draft);
  const topics = await getTopics();
  const press = await getPress();
  const channels = activeChannels();

  const body = [
    `# ${SITE.name}`,
    '',
    `> ${PERSON.description}`,
    '',
    `Primärquelle zu ${PERSON.name} (${PERSON.jobTitle}). Alle Texte sind aus erster Hand geschrieben und datiert.`,
    `Jede Exploration ist auch als Markdown abrufbar: "/explorationen/<slug>.md".`,
    '',
    '## Person',
    '',
    `- [Über ${PERSON.name}](${u('/ueber/')})`,
    `- [Presse: Biografie, Fakten, Fotos](${u('/presse/')})`,
    ...channels.map((c) => `- [${c.name}](${c.url})`),
    '',
    '## Expertise und Positionen',
    '',
    ...topics.map((t) => `- [${t.data.title}](${u(`/themen/${t.id}/`)}): ${t.data.definition} Position von ${PERSON.name}: „${t.data.position}“${t.data.since ? ` (befasst sich damit seit ${t.data.since})` : ''}`),
    '',
    '## Explorationen',
    '',
    ...explorations.map((e) => `- [${e.data.title}](${u(`/explorationen/${e.id}.md`)}) (${isoDate(e.data.updated ?? e.data.pubDate)}): ${e.data.summary}`),
    '',
    '## Projekte',
    '',
    ...projects.map((p) => `- [${p.data.title}](${u(`/projekte/${p.id}/`)}): ${PROJECT_KIND_LABELS[p.data.kind]}, ${STATUS_LABELS[p.data.status]}, seit ${p.data.started.getFullYear()}. ${p.data.summary}`),
    '',
    ...(press.length ? ['## Presse', '', ...press.map((p) => `- ${p.data.outlet}, ${isoDate(p.data.date)}: „${p.data.title}“`), ''] : []),
    '## Optional',
    '',
    `- [Alle Explorationen im Volltext](${u('/llms-full.txt')})`,
    `- [Logbuch](${u('/logbuch/')})`,
    `- [Medien](${u('/medien/')})`,
    `- [RSS](${u('/rss.xml')})`,
    `- [Sitemap](${u('/sitemap.xml')})`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
