/**
 * Maschinenlesbare Markdown-Fassung jedes Artikels: /artikel/<slug>.md
 * Für KI-Crawler und Agenten (AISO). Verlinkt per <link rel="alternate">.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getEntry } from 'astro:content';
import { SITE, PERSON } from '@/site.config';
import { type Article, getArticles, cleanBody, isoDate, tagLabel } from '@/lib/content';

export const getStaticPaths = (async () => {
  const articles = await getArticles();
  return articles.map((article) => ({ params: { slug: article.id }, props: { article } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { article } = props as { article: Article };
  const d = article.data;
  const project = d.project ? await getEntry(d.project) : undefined;
  const url = `${SITE.url}/artikel/${article.id}/`;

  const md = [
    `# ${d.title}`,
    '',
    `> ${d.summary}`,
    '',
    `- Autor: ${PERSON.name} (${SITE.url}/ueber/)`,
    `- Veröffentlicht: ${isoDate(d.pubDate)}`,
    d.updated ? `- Aktualisiert: ${isoDate(d.updated)}` : null,
    `- Themen: ${d.tags.map(tagLabel).join(', ')}`,
    project ? `- Projekt: ${project.data.title} (${SITE.url}/projekte/${project.id}/)` : null,
    `- Kanonische URL: ${url}`,
    '',
    d.keyTakeaways?.length ? ['## Kernaussagen', '', ...d.keyTakeaways.map((t) => `- ${t}`), ''].join('\n') : null,
    cleanBody(article.body),
    d.faq?.length ? ['', '## Häufige Fragen', '', ...d.faq.map((f) => `### ${f.q}\n\n${f.a}\n`)].join('\n') : null,
  ]
    .filter((l) => l !== null)
    .join('\n');

  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
