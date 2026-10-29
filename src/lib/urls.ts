/**
 * Die kanonische Liste ALLER indexierbaren URLs. Einzige Quelle für
 * sitemap.xml und llms.txt – so können beide nie auseinanderlaufen.
 * Neue indexierbare Route? → hier ergänzen.
 */
import { getPages, DEDICATED_PAGES } from './content';

export type IndexableUrl = { path: string; title: string; description?: string; lastmod?: Date; section: string };

export async function getIndexableUrls(): Promise<IndexableUrl[]> {
  const pages = (await getPages()).filter((p) => !p.data.noindex && !DEDICATED_PAGES.includes(p.id));
  return [
    { path: '/', title: 'Startseite', section: 'Hauptseiten' },
    ...pages.map((p) => ({ path: `/${p.id}/`, title: p.data.title, description: p.data.description, lastmod: p.data.updated, section: 'Seiten' })),
  ];
}
