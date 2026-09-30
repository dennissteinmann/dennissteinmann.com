#!/usr/bin/env node
/**
 * Neue Inhalte anlegen – ohne Frontmatter auswendig zu kennen.
 *
 *   npm run new artikel "Mein Titel"
 *   npm run new projekt "Projektname"
 *   npm run new log "Was passiert ist" [projekt-slug]
 *   npm run new seite "Seitentitel"
 *
 * Artikel & Projekte bekommen einen eigenen Ordner – Bilder einfach
 * daneben legen und relativ einbinden (./bild.jpg). Siehe docs/CONTENT.md.
 */
import fs from 'node:fs';
import path from 'node:path';

const [type, title, extra] = process.argv.slice(2);
const TYPES = ['artikel', 'projekt', 'log', 'seite'];

if (!TYPES.includes(type) || !title) {
  console.error(`Nutzung: npm run new <${TYPES.join('|')}> "Titel" [projekt-slug]`);
  process.exit(1);
}

const slugify = (s) =>
  s.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .split('-').slice(0, 8).join('-');

const today = new Date().toISOString().slice(0, 10);
const slug = slugify(title);
const root = path.resolve(import.meta.dirname, '..', 'src', 'content');

const write = (file, content) => {
  if (fs.existsSync(file)) {
    console.error(`✗ Existiert bereits: ${path.relative(process.cwd(), file)}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`✓ Angelegt: ${path.relative(process.cwd(), file)}`);
};

const templates = {
  artikel: () => [
    path.join(root, 'articles', slug, 'index.mdx'),
    `---
title: ${JSON.stringify(title)}
# 70–165 Zeichen. Das Suchergebnis-Snippet: Nutzen + Neugier.
description: "TODO: Worum geht es in diesem Artikel und warum sollte man ihn lesen? Nutzen plus Neugier, 70–165 Zeichen."
# Answer-first: 2–4 Sätze, die die Kernfrage direkt beantworten. Wird von KI-Suche zitiert.
summary: >-
  TODO: Die Kurzfassung. Was ist passiert, was ist das Ergebnis, was ist die wichtigste
  Erkenntnis? Mindestens 120 Zeichen.
pubDate: ${today}
draft: true
tags: [build-in-public]
# project: projekt-slug
# cover: ./cover.jpg
# coverAlt: Beschreibung des Titelbilds
keyTakeaways:
  - TODO erste Kernaussage
  - TODO zweite Kernaussage
# faq:
#   - q: Echte Frage, die Leute stellen?
#     a: Direkte Antwort in 1–3 Sätzen.
# social:
#   hook: Der erste Satz des Carousels
#   slides:
#     - title: Folientitel
#       text: Folientext
---

Einstieg: Worum geht es, warum jetzt?

## Erste Zwischenüberschrift

Text …
`,
  ],
  projekt: () => [
    path.join(root, 'projects', slug, 'index.mdx'),
    `---
title: ${JSON.stringify(title)}
description: "TODO: Was ist das Projekt, für wen ist es gedacht und wie ist der aktuelle Stand? 70–165 Zeichen."
summary: >-
  TODO: Das Projekt in 2–3 Sätzen – welches Problem es löst, wie es funktioniert und wo es heute steht.
status: aktiv # idee | aktiv | pausiert | abgeschlossen | verkauft
role: Gründer
started: ${today}
# url: https://…
tags: []
order: 50
draft: true
---

## Worum es geht

…
`,
  ],
  log: () => [
    path.join(root, 'log', `${today}-${slug}.md`),
    `---
date: ${today}
title: ${JSON.stringify(title)}
${extra ? `project: ${extra}` : '# project: projekt-slug'}
# article: artikel-slug
---

Kurz und konkret: Was ist passiert, welche Zahl, welche Erkenntnis?
`,
  ],
  seite: () => [
    path.join(root, 'pages', `${slug}.mdx`),
    `---
title: ${JSON.stringify(title)}
description: "TODO: Worum geht es auf dieser Seite und was findet man hier? Klar und konkret, 70–165 Zeichen."
# kicker: Kleine Zeile über dem Titel
# noindex: true
draft: true
---

Inhalt …
`,
  ],
};

const [file, content] = templates[type]();
write(file, content);
if (type === 'artikel') console.log(`  → lokal: http://localhost:4321/artikel/${slug}/  (draft: true – im Live-Build unsichtbar)`);
if (type === 'seite') console.log(`  → lokal: http://localhost:4321/${slug}/  (in src/site.config.ts verlinken, falls in der Navigation gewünscht)`);
