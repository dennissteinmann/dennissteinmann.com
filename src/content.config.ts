/**
 * Content-Modell. Die SEO-/AISO-Regeln aus docs/SEO.md werden hier
 * technisch erzwungen – ein Inhalt ohne Kurzfassung bricht den Build ab.
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Nur Kleinbuchstaben, Ziffern und Bindestriche (z. B. "mobile-apps").');
const seoTitle = z.string().min(5).max(80);
const metaDescription = z
  .string()
  .min(70, 'Description zu kurz (min. 70 Zeichen).')
  .max(165, 'Description zu lang (max. 165 Zeichen).');
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Farbe als #rrggbb');
const folderId = ({ entry }: { entry: string }) => entry.split('/')[0];

/** Wo wurde ein Inhalt verbreitet? → Studio-Übersicht + JSON-LD `subjectOf`. */
const distribution = z
  .array(z.object({ channel: z.string(), url: z.url().optional(), date: z.coerce.date().optional() }))
  .default([]);

const socialSchema = z
  .object({
    hook: z.string().max(90).optional(),
    slides: z.array(z.object({ title: z.string().max(70), text: z.string().max(280).optional() })).max(8).optional(),
    cta: z.string().max(90).optional(),
    caption: z.string().max(2800).optional(),
  })
  .optional();

/** Dateien zu Projekten ohne eigene Website (PDF, Decks, Whitepaper …). */
const documents = z
  .array(
    z.object({
      title: z.string(),
      /** Pfad unter /public, z. B. /dokumente/projekt/pitch.pdf – oder externe URL */
      href: z.string(),
      kind: z.string().default('PDF'),
      date: z.coerce.date().optional(),
      description: z.string().optional(),
    }),
  )
  .default([]);

/**
 * EXPLORATIONEN – Langform-Gedanken. Wachsen über Zeit (Digital Garden):
 * `stage` zeigt die Reife, `changelog` die Entwicklung.
 */
const explorations = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/explorations', generateId: folderId }),
  schema: ({ image }) =>
    z.object({
      title: seoTitle,
      seoTitle: seoTitle.optional(),
      description: metaDescription,
      /** Answer-first: die These / Kernaussage in 2–4 Sätzen. Wichtigstes AISO-Feld. */
      summary: z.string().min(120).max(600),
      kind: z.enum(['essay', 'theorie', 'geschichte', 'analyse', 'anleitung', 'notiz']).default('essay'),
      stage: z.enum(['keimling', 'wachsend', 'ausgereift']).default('wachsend'),
      pubDate: z.coerce.date(),
      updated: z.coerce.date().optional(),
      changelog: z.array(z.object({ date: z.coerce.date(), note: z.string() })).default([]),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Themen-Slugs (src/content/topics). Erstes Thema = Hauptthema. */
      topics: z.array(reference('topics')).min(1).max(5),
      projects: z.array(reference('projects')).default([]),
      keyTakeaways: z.array(z.string().max(220)).max(7).optional(),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
      sources: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
      social: socialSchema,
      distribution,
      canonical: z.url().optional(),
    }),
});

/**
 * PROJEKTE – jede Art bekommt ein eigenes Kartendesign (`kind`).
 * `color` ist die Markenfarbe DES PROJEKTS (nicht der Website).
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/projects', generateId: folderId }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(2).max(60),
      description: metaDescription,
      summary: z.string().min(60).max(600),
      kind: z.enum(['app', 'software', 'website', 'unternehmen', 'medien', 'plattform', 'forschung']),
      status: z.enum(['idee', 'aktiv', 'pausiert', 'abgeschlossen', 'verkauft']),
      role: z.string().optional(),
      started: z.coerce.date(),
      ended: z.coerce.date().optional(),
      url: z.url().optional(),
      /** Weitere Links: App Store, Play Store, Repo … */
      links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
      /** App-Icon / Logo (quadratisch) */
      icon: image().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      color: hex.optional(),
      /** Kartengröße im Projekt-Raster */
      size: z.enum(['s', 'm', 'l']).default('m'),
      topics: z.array(reference('topics')).default([]),
      documents,
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

/**
 * THEMEN – Experten-Hubs. Jede Datei = eine Seite /themen/<slug>/ mit
 * Definition, eigener Position und allen zugehörigen Inhalten.
 * Grundlage für `knowsAbout` und für Empfehlungen durch KI-Assistenten.
 */
const topics = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/topics' }),
  schema: z.object({
    title: z.string().min(2).max(60),
    description: metaDescription,
    /** Neutrale Ein-Satz-Definition des Begriffs. */
    definition: z.string().min(40).max(300),
    /** Dennis' eigene Position / These zu diesem Thema (zitierfähig). */
    position: z.string().min(60).max(500),
    /** Seit wann beschäftigt sich Dennis damit (Erfahrungs-Signal). */
    since: z.number().int().optional(),
    /** Wikidata/Wikipedia-URL zur Begriffs-Entität (Disambiguierung für KI). */
    sameAs: z.url().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    order: z.number().default(100),
  }),
});

/** MEDIEN – Bilder, Videos, Podcasts, Vorträge, Interviews. */
const media = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/media' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kind: z.enum(['foto', 'video', 'podcast', 'vortrag', 'interview', 'dokument']),
      date: z.coerce.date(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** Eigene Datei unter /public/media/… oder externer Link */
      href: z.string().optional(),
      source: z.string().optional(),
      project: reference('projects').optional(),
      draft: z.boolean().default(false),
    }),
});

/** PRESSE – Berichterstattung über Dennis und seine Projekte. */
const press = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/press' }),
  schema: z.object({
    outlet: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    url: z.url().optional(),
    /** lokal archivierte Kopie unter /public/presse/… */
    archive: z.string().optional(),
    project: reference('projects').optional(),
    draft: z.boolean().default(false),
  }),
});

/** LOGBUCH – kurze Fortschrittsnotizen ohne eigene URL. */
const log = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/log' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().max(100),
    project: reference('projects').optional(),
    exploration: reference('explorations').optional(),
    draft: z.boolean().default(false),
  }),
});

/** SEITEN – freie Unterseiten /<slug>/ */
const pages = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(2).max(80),
      seoTitle: seoTitle.optional(),
      description: metaDescription,
      cover: image().optional(),
      coverAlt: z.string().optional(),
      updated: z.coerce.date().optional(),
      noindex: z.boolean().default(false),
      schemaType: z.enum(['WebPage', 'AboutPage', 'ContactPage', 'ProfilePage']).default('WebPage'),
      draft: z.boolean().default(false),
    }),
});

export const collections = { explorations, projects, topics, media, press, log, pages };
