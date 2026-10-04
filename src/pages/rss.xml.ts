import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, PERSON } from '@/site.config';
import { getExplorations } from '@/lib/content';

export async function GET(context: APIContext) {
  const items = (await getExplorations()).filter((e) => !e.data.draft);
  return rss({
    title: `${SITE.name} – Explorationen`,
    description: PERSON.description,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    customData: '<language>de-de</language>',
    items: items.map((e) => ({ title: e.data.title, description: e.data.summary, pubDate: e.data.pubDate, link: `/explorationen/${e.id}/` })),
  });
}
