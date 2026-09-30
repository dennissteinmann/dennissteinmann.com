/**
 * Die kanonische Liste ALLER indexierbaren URLs. Einzige Quelle für
 * sitemap.xml und llms.txt – so können beide nie auseinanderlaufen.
 */
import { NAV } from '@/site.config';
import { getArticles, getProjects, getPages, getAllTags, DEDICATED_PAGES } from './content';

export type IndexableUrl = { path: string; title: string; description?: string; lastmod?: Date; section: string };

export async function getIndexableUrls(): Promise<IndexableUrl[]> {
  const articles = await getArticles();
  const projects = await getProjects();
  const pages = (await getPages()).filter((p) => !p.data.noindex);
  const latest = articles[0]?.data.updated ?? articles[0]?.data.pubDate;

  const urls: IndexableUrl[] = [
    { path: '/', title: 'Startseite', section: 'Hauptseiten', lastmod: latest },
    ...NAV.filter((n) => !DEDICATED_PAGES.includes(n.href.replaceAll('/', ''))).map((n) => ({
      path: n.href, title: n.label, description: n.description, section: 'Hauptseiten', lastmod: latest,
    })),
    ...pages.map((p) => ({
      path: `/${p.id}/`, title: p.data.title, description: p.data.description, lastmod: p.data.updated, section: 'Seiten',
    })),
    ...articles.map((a) => ({
      path: `/artikel/${a.id}/`, title: a.data.title, description: a.data.summary, lastmod: a.data.updated ?? a.data.pubDate, section: 'Artikel',
    })),
    ...projects.map((p) => ({
      path: `/projekte/${p.id}/`, title: p.data.title, description: p.data.summary, section: 'Projekte',
    })),
  ];

  // Themen nur, wenn nicht "dünn" (gleiche Regel wie in themen/[tag].astro)
  for (const { tag, count } of await getAllTags()) {
    if (count >= 2) urls.push({ path: `/themen/${tag}/`, title: tag, section: 'Themen' });
  }
  return urls;
}
