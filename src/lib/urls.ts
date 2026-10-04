/**
 * Die kanonische Liste ALLER indexierbaren URLs. Einzige Quelle für
 * sitemap.xml und llms.txt – so können beide nie auseinanderlaufen.
 * Neue indexierbare Route? → hier ergänzen.
 */
import { NAV } from '@/site.config';
import { getExplorations, getProjects, getPages, getTopics, DEDICATED_PAGES } from './content';

export type IndexableUrl = { path: string; title: string; description?: string; lastmod?: Date; section: string };

export async function getIndexableUrls(): Promise<IndexableUrl[]> {
  const explorations = await getExplorations();
  const projects = (await getProjects()).filter((p) => !p.data.draft);
  const pages = (await getPages()).filter((p) => !p.data.noindex && !DEDICATED_PAGES.includes(p.id));
  const latest = explorations[0]?.data.updated ?? explorations[0]?.data.pubDate;

  return [
    { path: '/', title: 'Startseite', section: 'Hauptseiten', lastmod: latest },
    ...NAV.map((n) => ({ path: n.href, title: n.label, description: n.description, section: 'Hauptseiten', lastmod: latest })),
    { path: '/logbuch/', title: 'Logbuch', section: 'Hauptseiten' },
    ...pages.map((p) => ({ path: `/${p.id}/`, title: p.data.title, description: p.data.description, lastmod: p.data.updated, section: 'Seiten' })),
    ...explorations.filter((e) => !e.data.draft).map((e) => ({
      path: `/explorationen/${e.id}/`, title: e.data.title, description: e.data.summary, lastmod: e.data.updated ?? e.data.pubDate, section: 'Explorationen',
    })),
    ...(await getTopics()).map((t) => ({ path: `/themen/${t.id}/`, title: t.data.title, description: t.data.position, section: 'Themen' })),
    ...projects.map((p) => ({ path: `/projekte/${p.id}/`, title: p.data.title, description: p.data.summary, section: 'Projekte' })),
  ];
}
