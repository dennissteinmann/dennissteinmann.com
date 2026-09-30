/**
 * Leitet aus einem Artikel das komplette Social-Paket ab:
 * Carousel-Folien + Post-Text. Frontmatter `social` überschreibt alles,
 * sonst wird aus title / summary / keyTakeaways generiert.
 */
import { SITE } from '@/site.config';
import { type Article, formatNumber, tagLabel } from './content';

export type Slide = { kind: 'cover' | 'content' | 'cta'; title?: string; text?: string };

export function getSlides(article: Article): Slide[] {
  const d = article.data;
  const s = d.social ?? {};
  const body: Slide[] = s.slides?.length
    ? s.slides.map((x) => ({ kind: 'content', title: x.title, text: x.text }))
    : (d.keyTakeaways ?? []).slice(0, 6).map((t) => ({ kind: 'content', text: t }));
  return [
    { kind: 'cover', title: s.hook ?? d.title },
    ...body,
    { kind: 'cta', title: s.cta ?? 'Die ganze Geschichte', text: d.description },
  ];
}

export function getCaption(article: Article, number?: number): string {
  const d = article.data;
  if (d.social?.caption) return d.social.caption.trim();
  const url = `${SITE.url}/artikel/${article.id}/`;
  const hashtags = d.tags.map((t) => `#${tagLabel(t).replace(/\s+/g, '')}`).join(' ');
  return [
    d.social?.hook ?? d.title,
    '',
    d.summary,
    '',
    ...(d.keyTakeaways?.length ? [...d.keyTakeaways.map((t) => `→ ${t}`), ''] : []),
    `${number ? `${formatNumber(number)} – ` : ''}Der ganze Artikel: ${url}`,
    '',
    hashtags,
  ].join('\n');
}
