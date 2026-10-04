import { getCollection, type CollectionEntry } from 'astro:content';

export type Exploration = CollectionEntry<'explorations'>;
export type Project = CollectionEntry<'projects'>;
export type Topic = CollectionEntry<'topics'>;
export type MediaItem = CollectionEntry<'media'>;
export type PressItem = CollectionEntry<'press'>;
export type LogEntry = CollectionEntry<'log'>;
export type Page = CollectionEntry<'pages'>;

/** Entwürfe sind lokal (astro dev) sichtbar, im Produktions-Build nie. */
const visible = (e: { data: { draft?: boolean } }) => import.meta.env.DEV || !e.data.draft;
const byDateDesc = <T>(get: (x: T) => Date) => (a: T, b: T) => get(b).valueOf() - get(a).valueOf();

export const getExplorations = async () =>
  (await getCollection('explorations', visible)).sort(byDateDesc((e) => e.data.pubDate));
export const getProjects = async () =>
  (await getCollection('projects', visible)).sort((a, b) => a.data.order - b.data.order || b.data.started.valueOf() - a.data.started.valueOf());
export const getTopics = async () => (await getCollection('topics')).sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
export const getMedia = async () => (await getCollection('media', visible)).sort(byDateDesc((e) => e.data.date));
export const getPress = async () => (await getCollection('press', visible)).sort(byDateDesc((e) => e.data.date));
export const getLog = async () => (await getCollection('log', visible)).sort(byDateDesc((e) => e.data.date));
export const getPages = () => getCollection('pages', visible);

/** Einträge aus src/content/pages mit eigener .astro-Route. */
export const DEDICATED_PAGES = ['ueber'];

export function readingTime(body = ''): number {
  const words = body.replace(/```[\s\S]*?```/g, '').replace(/<[^>]+>/g, '').replace(/^import .*$/gm, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
export const wordCount = (body = '') => body.split(/\s+/).filter(Boolean).length;
export const minutesLabel = (m: number) => `${m} ${m === 1 ? 'Minute' : 'Minuten'}`;

const longFmt = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const monthFmt = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' });
export const formatDate = (d: Date) => longFmt.format(d);
export const formatMonth = (d: Date) => monthFmt.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const KIND_LABELS: Record<Exploration['data']['kind'], string> = {
  essay: 'Essay', theorie: 'Theorie', geschichte: 'Geschichte', analyse: 'Analyse', anleitung: 'Anleitung', notiz: 'Notiz',
};
export const STAGE_LABELS: Record<Exploration['data']['stage'], string> = {
  keimling: 'erste Gedanken', wachsend: 'wird weitergedacht', ausgereift: 'ausgereift',
};
export const PROJECT_KIND_LABELS: Record<Project['data']['kind'], string> = {
  app: 'App', software: 'Software', website: 'Website', unternehmen: 'Unternehmen', medien: 'Medien', plattform: 'Plattform', forschung: 'Forschung',
};
export const STATUS_LABELS: Record<Project['data']['status'], string> = {
  idee: 'Idee', aktiv: 'Aktiv', pausiert: 'Pausiert', abgeschlossen: 'Abgeschlossen', verkauft: 'Verkauft',
};
export const MEDIA_KIND_LABELS: Record<MediaItem['data']['kind'], string> = {
  foto: 'Foto', video: 'Video', podcast: 'Podcast', vortrag: 'Vortrag', interview: 'Interview', dokument: 'Dokument',
};

export const projectYears = (p: Project) =>
  `${p.data.started.getFullYear()}${p.data.ended ? `–${p.data.ended.getFullYear()}` : p.data.status === 'aktiv' ? '–' : ''}`;

/** Verwandte Explorationen: gemeinsame Projekte > gemeinsame Themen > Aktualität. */
export async function getRelated(e: Exploration, limit = 3): Promise<Exploration[]> {
  const ids = (xs: { id: string }[]) => xs.map((x) => x.id);
  const topics = ids(e.data.topics), projects = ids(e.data.projects);
  const score = (o: Exploration) =>
    ids(o.data.projects).filter((p) => projects.includes(p)).length * 10 + ids(o.data.topics).filter((t) => topics.includes(t)).length * 3;
  return (await getExplorations())
    .filter((o) => o.id !== e.id)
    .map((o) => ({ o, s: score(o) }))
    .filter(({ s }) => s > 0)
    .sort((x, y) => y.s - x.s || y.o.data.pubDate.valueOf() - x.o.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ o }) => o);
}

/** Markdown/MDX-Body für Maschinen säubern (llms-full.txt, .md-Endpunkte). */
export const cleanBody = (body = '') =>
  body.replace(/^import .*$/gm, '').replace(/^export .*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\n{3,}/g, '\n\n').trim();
