/** Carousel-Folien als PNG (1080×1350, LinkedIn/Instagram-Hochformat). */
import type { APIRoute, GetStaticPaths } from 'astro';
import { type Exploration, getExplorations } from '@/lib/content';
import { getSlides, type Slide } from '@/lib/social';
import { slideTemplate, renderPng, pngResponse } from '@/lib/og';

export const getStaticPaths = (async () =>
  (await getExplorations()).flatMap((entry) => {
    const slides = getSlides(entry);
    return slides.map((slide, i) => ({ params: { slug: entry.id, n: String(i + 1) }, props: { entry, slide, index: i + 1, total: slides.length } }));
  })) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { entry, slide, index, total } = props as { entry: Exploration; slide: Slide; index: number; total: number };
  return pngResponse(await renderPng(slideTemplate({ ...slide, index, total, url: `dennissteinmann.com/explorationen/${entry.id}/` }), 1080, 1350));
};
