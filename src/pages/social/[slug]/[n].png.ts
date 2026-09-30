/** Carousel-Folien als PNG (1080×1350, LinkedIn/Instagram-Hochformat). */
import type { APIRoute, GetStaticPaths } from 'astro';
import { type Article, getArticles, getArticleNumbers, formatNumber } from '@/lib/content';
import { getSlides, type Slide } from '@/lib/social';
import { slideTemplate, renderPng, pngResponse } from '@/lib/og';

export const getStaticPaths = (async () => {
  const numbers = await getArticleNumbers();
  return (await getArticles()).flatMap((article) => {
    const slides = getSlides(article);
    return slides.map((slide, i) => ({
      params: { slug: article.id, n: String(i + 1) },
      props: { article, slide, index: i + 1, total: slides.length, number: numbers.get(article.id) },
    }));
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { article, slide, index, total, number } = props as { article: Article; slide: Slide; index: number; total: number; number?: number };
  const node = slideTemplate({
    ...slide,
    index,
    total,
    number: number ? formatNumber(number) : undefined,
    url: `dennissteinmann.com/artikel/${article.id}/`,
  });
  return pngResponse(await renderPng(node, 1080, 1350));
};
