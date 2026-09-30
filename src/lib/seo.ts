/**
 * JSON-LD-Bausteine. Alle Entitäten haben stabile @id-URIs, damit
 * Suchmaschinen und KI-Systeme sie seitenübergreifend verknüpfen können
 * (Knowledge Graph). Die @ids NIE ändern – siehe docs/SEO.md.
 */
import { SITE, PERSON } from '@/site.config';

export const ID = {
  person: `${SITE.url}/#person`,
  website: `${SITE.url}/#website`,
};

export const abs = (path: string) => new URL(path, SITE.url).href;

export const PERSON_IMAGE = '/media/brand/dennis-steinmann.jpg';

export function personSchema(image: string = PERSON_IMAGE) {
  return {
    '@type': 'Person',
    '@id': ID.person,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    url: abs('/ueber/'),
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    knowsAbout: PERSON.knowsAbout,
    image: abs(image),
    ...(PERSON.sameAs.filter(Boolean).length ? { sameAs: PERSON.sameAs.filter(Boolean) } : {}),
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
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function articleSchema(a: {
  path: string;
  title: string;
  description: string;
  summary: string;
  pubDate: Date;
  updated?: Date;
  image: string;
  tags: string[];
  wordCount: number;
  projectPath?: string;
  projectName?: string;
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
    datePublished: a.pubDate.toISOString(),
    dateModified: (a.updated ?? a.pubDate).toISOString(),
    inLanguage: SITE.lang,
    image: { '@type': 'ImageObject', url: abs(a.image), width: 1200, height: 630 },
    author: { '@id': ID.person },
    publisher: { '@id': ID.person },
    isPartOf: { '@id': ID.website },
    keywords: a.tags.join(', '),
    wordCount: a.wordCount,
    ...(a.projectPath ? { about: { '@type': 'CreativeWork', name: a.projectName, url: abs(a.projectPath) } } : {}),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
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
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(it.path), name: it.name })),
    },
  };
}

/** Bündelt mehrere Knoten in einen @graph. */
export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
