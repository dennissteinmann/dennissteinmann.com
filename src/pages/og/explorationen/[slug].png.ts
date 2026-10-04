import type { APIRoute, GetStaticPaths } from 'astro';
import { type Exploration, getExplorations, KIND_LABELS, formatMonth } from '@/lib/content';
import { ogTemplate, renderPng, pngResponse } from '@/lib/og';

export const getStaticPaths = (async () =>
  (await getExplorations()).map((entry) => ({ params: { slug: entry.id }, props: { entry } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Exploration };
  return pngResponse(await renderPng(ogTemplate({ title: entry.data.title, meta: `${KIND_LABELS[entry.data.kind]}, ${formatMonth(entry.data.pubDate)}` }), 1200, 630));
};
