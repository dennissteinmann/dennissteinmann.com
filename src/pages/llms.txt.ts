/**
 * /llms.txt nach https://llmstxt.org – kuratierte Übersicht für Sprachmodelle,
 * vollständig aus INHALT.md: wer ist das, welche Projekte, wie erreichbar.
 * Bewusst faktisch – keine Anweisungen an Modelle.
 */
import type { APIRoute } from 'astro';
import { SITE, PERSON, activeChannels } from '@/site.config';
import { getInhalt, blockText } from '@/lib/inhalt';

export const GET: APIRoute = async () => {
  const u = (p: string) => new URL(p, SITE.url).href;
  const inhalt = getInhalt();

  const body = [
    `# ${SITE.name}`,
    '',
    `> ${PERSON.description}`,
    '',
    `Primärquelle zu ${PERSON.name} (${PERSON.jobTitle}).`,
    '',
    '## Profile',
    '',
    `- [Website](${u('/')})`,
    `- [Kontakt](${u('/kontakt/')})`,
    ...activeChannels().map((c) => `- [${c.name}](${c.url})`),
    '',
    ...inhalt.abschnitte.flatMap((a) => [
      `## ${a.titel}`,
      '',
      ...(a.intro.length ? [blockText(a.intro), ''] : []),
      ...a.eintraege.map((e) => {
        const meta = [e.rolle, e.zeit, e.ort, e.status].filter(Boolean).join(', ');
        const text = blockText(e.text);
        return `- [${e.titel}](${e.link ?? u(`/#${e.id}`)})${meta ? ` (${meta})` : ''}${text ? `: ${text}` : ''}`;
      }),
      '',
    ]),
    '## Optional',
    '',
    `- [Sitemap](${u('/sitemap.xml')})`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
