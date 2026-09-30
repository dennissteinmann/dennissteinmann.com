/**
 * Content-Schemas. Die SEO-/AISO-Regeln aus docs/SEO.md werden hier
 * technisch erzwungen: Ein Artikel ohne ordentliche Description oder
 * Zusammenfassung bricht den Build ab – nicht erst das Ranking.
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** URL-sicherer Slug: nur a–z, 0–9 und Bindestrich. */
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Nur Kleinbuchstaben, Ziffern und Bindestriche (z. B. "mobile-apps").');

const seoTitle = z.string().min(10).max(80);
/** Meta-Description: 70–165 Zeichen (Snippet-Länge in der SERP). */
const metaDescription = z
  .string()
  .min(70, 'Description zu kurz (min. 70 Zeichen).')
  .max(165, 'Description zu lang (max. 165 Zeichen).');

/** Social-Carousel-Folien (LinkedIn/Instagram, 1080×1350). */
const socialSchema = z
  .object({
    /** Erste Folie: Hook. Fallback: Titel. */
    hook: z.string().max(90).optional(),
    slides: z
      .array(z.object({ title: z.string().max(70), text: z.string().max(280).optional() }))
      .max(8)
      .optional(),
    /** Letzte Folie. Fallback: "Ganzer Artikel auf dennissteinmann.com" */
    cta: z.string().max(90).optional(),
    /** Fertiger Post-Text für LinkedIn & Co. Fallback wird generiert. */
    caption: z.string().max(2800).optional(),
  })
  .optional();

const articles = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/articles', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      title: seoTitle,
      /** Optionaler abweichender <title> (sonst = title). */
      seoTitle: seoTitle.optional(),
      description: metaDescription,
      /**
       * Answer-first-Zusammenfassung (2–4 Sätze). Steht sichtbar oben im
       * Artikel, in llms.txt und im JSON-LD. Wichtigstes AISO-Feld.
       */
      summary: z.string().min(120).max(600),
      pubDate: z.coerce.date(),
      updated: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(slug).min(1).max(6),
      project: reference('projects').optional(),
      /** Kernaussagen als Liste – wird zu sichtbarer Box + Carousel-Fallback. */
      keyTakeaways: z.array(z.string().max(220)).max(7).optional(),
      /** Echte Fragen, die der Artikel beantwortet → FAQPage-Schema. */
      faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
      social: socialSchema,
      /** Nur setzen, wenn der Text zuerst woanders erschienen ist. */
      canonical: z.url().optional(),
    }).refine((d) => !d.cover || !!d.coverAlt, { message: 'coverAlt ist Pflicht, wenn ein cover gesetzt ist.', path: ['coverAlt'] }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/projects', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(2).max(60),
      description: metaDescription,
      summary: z.string().min(80).max(600),
      status: z.enum(['idee', 'aktiv', 'pausiert', 'abgeschlossen', 'verkauft']),
      role: z.string().optional(),
      started: z.coerce.date(),
      ended: z.coerce.date().optional(),
      url: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(slug).max(6).default([]),
      /** Sortierung auf /projekte/ – kleiner = weiter oben. */
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

/**
 * Logbuch: kurze Fortschrittsnotizen. Bewusst OHNE eigene URL
 * (Thin Content vermeiden) – sie leben gesammelt auf /logbuch/ und
 * auf der jeweiligen Projektseite, jeweils mit Anker.
 */
const log = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/log' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string().max(100),
    project: reference('projects').optional(),
    /** Optionaler Link auf einen ausführlichen Artikel. */
    article: reference('articles').optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Freie Unterseiten: /<slug>/. Neue Unterseite = neue MDX-Datei,
 * kein Code nötig. (Über, Kontakt, Impressum, Datenschutz, …)
 */
const pages = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(2).max(80),
      seoTitle: seoTitle.optional(),
      description: metaDescription,
      /** Kleine Zeile über der Headline (z. B. "Rechtliches") */
      kicker: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      updated: z.coerce.date().optional(),
      /** Rechtliche Seiten: noindex, nicht in Sitemap/llms.txt */
      noindex: z.boolean().default(false),
      /** schema.org-Typ der Seite */
      schemaType: z.enum(['WebPage', 'AboutPage', 'ContactPage', 'ProfilePage']).default('WebPage'),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles, projects, log, pages };
