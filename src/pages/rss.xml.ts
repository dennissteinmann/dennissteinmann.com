import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@/site.config';
import { getArticles, tagLabel } from '@/lib/content';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: `${SITE.name} – Artikel`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    customData: `<language>de-de</language>`,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.summary,
      pubDate: a.data.pubDate,
      link: `/artikel/${a.id}/`,
      categories: a.data.tags.map(tagLabel),
    })),
  });
}
