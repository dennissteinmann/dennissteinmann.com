/**
 * JSON-LD-Bausteine. Stabile @id-URIs verknüpfen alle Seiten zu einem
 * Wissensgraphen rund um die Person. @ids NIE ändern – siehe docs/SEO.md.
 */
import { SITE, PERSON, activeChannels } from '@/site.config';
import { getTopics, getPress } from './content';

export const ID = {
  person: `${SITE.url}/#person`,
  website: `${SITE.url}/#website`,
};
export const PERSON_IMAGE = '/media/brand/dennis-steinmann.jpg';
export const abs = (path: string) => new URL(path, SITE.url).href;

/**
 * Person mit Expertise (`knowsAbout` → Themen-Hubs) und Presse (`subjectOf`).
 * Async, weil Themen & Presse aus den Collections kommen.
 */
export async function personSchema() {
  const topics = await getTopics();
  const press = await getPress();
  const sameAs = activeChannels().map((c) => c.url);
  return {
    '@type': 'Person',
    '@id': ID.person,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    url: abs('/ueber/'),
    image: abs(PERSON_IMAGE),
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    nationality: PERSON.nationality,
    homeLocation: { '@type': 'Country', name: PERSON.homeLocation },
    knowsAbout: topics.map((t) => ({
      '@type': 'Thing',
      name: t.data.title,
      description: t.data.definition,
      url: abs(`/themen/${t.id}/`),
      ...(t.data.sameAs ? { sameAs: t.data.sameAs } : {}),
    })),
    ...(sameAs.length ? { sameAs } : {}),
    ...(press.length
      ? { subjectOf: press.map((p) => ({ '@type': 'NewsArticle', headline: p.data.title, publisher: { '@type': 'Organization', name: p.data.outlet }, datePublished: p.data.date.toISOString(), ...(p.data.url ? { url: p.data.url } : {}) })) }
      : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: abs('/'),
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': ID.person },
    author: { '@id': ID.person },
  };
}

export type Crumb = { name: string; path: string };
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function articleSchema(a: {
  path: string; title: string; description: string; summary: string; pubDate: Date; updated?: Date;
  image: string; topics: { name: string; path: string }[]; wordCount: number; genre: string;
  citations: { title: string; url: string }[]; distributed: string[];
}) {
  const url = abs(a.path);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline: a.title,
    description: a.description,
    abstract: a.summary,
    genre: a.genre,
    datePublished: a.pubDate.toISOString(),
    dateModified: (a.updated ?? a.pubDate).toISOString(),
    inLanguage: SITE.lang,
    image: { '@type': 'ImageObject', url: abs(a.image), width: 1200, height: 630 },
    author: { '@id': ID.person },
    publisher: { '@id': ID.person },
    isPartOf: { '@id': ID.website },
    about: a.topics.map((t) => ({ '@type': 'Thing', name: t.name, url: abs(t.path) })),
    keywords: a.topics.map((t) => t.name).join(', '),
    wordCount: a.wordCount,
    ...(a.citations.length ? { citation: a.citations.map((c) => ({ '@type': 'CreativeWork', name: c.title, url: c.url })) } : {}),
    ...(a.distributed.length ? { sameAs: a.distributed } : {}),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a, author: { '@id': ID.person } } })),
  };
}

export function collectionSchema(path: string, name: string, description: string, items: { path: string; name: string }[]) {
  return {
    '@type': 'CollectionPage',
    '@id': `${abs(path)}#collection`,
    url: abs(path),
    name,
    description,
    isPartOf: { '@id': ID.website },
    mainEntity: { '@type': 'ItemList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(it.path), name: it.name })) },
  };
}

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
