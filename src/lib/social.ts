/**
 * Leitet aus einer Exploration das Social-Paket ab: Carousel-Folien + Post-Text.
 * Frontmatter `social` überschreibt, sonst aus title / summary / keyTakeaways.
 */
import { getEntries } from 'astro:content';
import { SITE } from '@/site.config';
import type { Exploration } from './content';

export type Slide = { kind: 'cover' | 'content' | 'cta'; title?: string; text?: string };

export function getSlides(e: Exploration): Slide[] {
  const d = e.data;
  const s = d.social ?? {};
  const body: Slide[] = s.slides?.length
    ? s.slides.map((x) => ({ kind: 'content', title: x.title, text: x.text }))
    : (d.keyTakeaways ?? []).slice(0, 6).map((t) => ({ kind: 'content', text: t }));
  return [{ kind: 'cover', title: s.hook ?? d.title }, ...body, { kind: 'cta', title: s.cta ?? 'Weiterdenken', text: d.description }];
}

export async function getCaption(e: Exploration): Promise<string> {
  const d = e.data;
  if (d.social?.caption) return d.social.caption.trim();
  const topics = await getEntries(d.topics);
  const hashtags = topics.map((t) => `#${t.data.title.replace(/[^\p{L}\p{N}]+/gu, '')}`).join(' ');
  return [
    d.social?.hook ?? d.title,
    '',
    d.summary,
    '',
    ...(d.keyTakeaways?.length ? [...d.keyTakeaways.map((t) => `– ${t}`), ''] : []),
    `Die ganze Exploration: ${SITE.url}/explorationen/${e.id}/`,
    '',
    hashtags,
  ].join('\n');
}
