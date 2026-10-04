/**
 * Maschinenlesbare Markdown-Fassung jeder Exploration: /explorationen/<slug>.md
 * Für KI-Crawler und Agenten (AISO). Verlinkt per <link rel="alternate">.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getEntries } from 'astro:content';
import { SITE, PERSON } from '@/site.config';
import { type Exploration, getExplorations, cleanBody, isoDate, KIND_LABELS } from '@/lib/content';

export const getStaticPaths = (async () =>
  (await getExplorations()).map((entry) => ({ params: { slug: entry.id }, props: { entry } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Exploration };
  const d = entry.data;
  const topics = await getEntries(d.topics);
  const lines = [
    `# ${d.title}`,
    '',
    `> ${d.summary}`,
    '',
    `- Autor: ${PERSON.name}, ${PERSON.jobTitle} (${SITE.url}/ueber/)`,
    `- Art: ${KIND_LABELS[d.kind]}`,
    `- Veröffentlicht: ${isoDate(d.pubDate)}${d.updated ? ` · Aktualisiert: ${isoDate(d.updated)}` : ''}`,
    `- Themen: ${topics.map((t) => `${t.data.title} (${SITE.url}/themen/${t.id}/)`).join(', ')}`,
    `- Kanonische URL: ${SITE.url}/explorationen/${entry.id}/`,
    '',
    ...(d.keyTakeaways?.length ? ['## Kernaussagen', '', ...d.keyTakeaways.map((t) => `- ${t}`), ''] : []),
    cleanBody(entry.body),
    ...(d.faq?.length ? ['', '## Fragen', '', ...d.faq.map((f) => `### ${f.q}\n\n${f.a}\n`)] : []),
    ...(d.sources.length ? ['', '## Quellen', '', ...d.sources.map((s) => `- [${s.title}](${s.url})`)] : []),
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
