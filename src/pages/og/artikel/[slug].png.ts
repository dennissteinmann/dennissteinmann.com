import type { APIRoute, GetStaticPaths } from 'astro';
import { type Article, getArticles, getArticleNumbers, formatNumber, readingTime, formatDate } from '@/lib/content';
import { ogTemplate, renderPng, pngResponse } from '@/lib/og';

export const getStaticPaths = (async () => {
  const numbers = await getArticleNumbers();
  return (await getArticles()).map((article) => ({ params: { slug: article.id }, props: { article, number: numbers.get(article.id) } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { article, number } = props as { article: Article; number?: number };
  const meta = `${formatDate(article.data.pubDate)} · ${readingTime(article.body)} Min. Lesezeit`;
  return pngResponse(await renderPng(ogTemplate({ kicker: number ? `${formatNumber(number)} · Artikel` : 'Artikel', title: article.data.title, meta }), 1200, 630));
};
