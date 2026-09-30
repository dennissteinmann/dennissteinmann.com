import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;
export type Project = CollectionEntry<'projects'>;
export type LogEntry = CollectionEntry<'log'>;
export type Page = CollectionEntry<'pages'>;

/** Entwürfe sind lokal (astro dev) sichtbar, im Produktions-Build nie. */
const isVisible = (e: { data: { draft?: boolean } }) => import.meta.env.DEV || !e.data.draft;

export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles', isVisible);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', isVisible);
  return all.sort((a, b) => a.data.order - b.data.order || b.data.started.valueOf() - a.data.started.valueOf());
}

export async function getLog(): Promise<LogEntry[]> {
  const all = await getCollection('log', isVisible);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPages(): Promise<Page[]> {
  return getCollection('pages', isVisible);
}

/**
 * Fortlaufende Nummer je Artikel (№ 001 = ältester). Ergibt sich aus dem
 * Veröffentlichungsdatum und ist daher stabil, solange nichts rückdatiert wird.
 */
export async function getArticleNumbers(): Promise<Map<string, number>> {
  const published = (await getArticles()).slice().reverse();
  return new Map(published.map((a, i) => [a.id, i + 1]));
}

export const formatNumber = (n: number) => `№ ${String(n).padStart(3, '0')}`;

export function readingTime(body = ''): number {
  const words = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^import .*$/gm, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function wordCount(body = ''): number {
  return body.split(/\s+/).filter(Boolean).length;
}

const dateFmt = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
const shortFmt = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
export const formatDate = (d: Date) => dateFmt.format(d);
export const formatDateShort = (d: Date) => shortFmt.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Themen: Anzeigenamen für Slugs. Unbekannte Slugs werden hübsch formatiert. */
export const TAG_LABELS: Record<string, string> = {
  'mobile-apps': 'Mobile Apps',
  'personal-brand': 'Personal Brand',
  seo: 'SEO',
  ki: 'KI',
  'build-in-public': 'Build in Public',
  unternehmertum: 'Unternehmertum',
  software: 'Software',
  design: 'Design',
};
export const tagLabel = (t: string) =>
  TAG_LABELS[t] ?? t.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const a of await getArticles()) for (const t of a.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  for (const p of await getProjects()) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Verwandte Artikel: gleiches Projekt > gemeinsame Themen > Aktualität. */
export async function getRelated(article: Article, limit = 3): Promise<Article[]> {
  const all = (await getArticles()).filter((a) => a.id !== article.id);
  const score = (a: Article) =>
    (article.data.project && a.data.project?.id === article.data.project.id ? 10 : 0) +
    a.data.tags.filter((t) => article.data.tags.includes(t)).length * 3;
  return all
    .map((a) => ({ a, s: score(a) }))
    .filter(({ s }) => s > 0)
    .sort((x, y) => y.s - x.s || y.a.data.pubDate.valueOf() - x.a.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ a }) => a);
}

export const STATUS_LABELS: Record<Project['data']['status'], string> = {
  idee: 'Idee',
  aktiv: 'Aktiv',
  pausiert: 'Pausiert',
  abgeschlossen: 'Abgeschlossen',
  verkauft: 'Verkauft',
};

/** Markdown/MDX-Body für Maschinen säubern (llms-full.txt, .md-Endpunkte). */
export function cleanBody(body = ''): string {
  return body
    .replace(/^import .*$/gm, '')
    .replace(/^export .*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Einträge aus src/content/pages mit eigener .astro-Route (nicht über [slug].astro). */
export const DEDICATED_PAGES = ['ueber'];
