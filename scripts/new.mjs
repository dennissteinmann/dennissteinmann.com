#!/usr/bin/env node
/**
 * Neue Inhalte anlegen – ohne Frontmatter auswendig zu kennen.
 *
 *   npm run new exploration "Titel"
 *   npm run new projekt "Name"
 *   npm run new thema "Thema"
 *   npm run new log "Was passiert ist" [projekt-slug]
 *   npm run new medium "Titel"
 *   npm run new presse "Schlagzeile"
 *   npm run new seite "Seitentitel"
 *
 * Siehe docs/CONTENT.md.
 */
import fs from 'node:fs';
import path from 'node:path';

const [type, title, extra] = process.argv.slice(2);
const TYPES = ['exploration', 'projekt', 'thema', 'log', 'medium', 'presse', 'seite'];
if (!TYPES.includes(type) || !title) {
  console.error(`Nutzung: npm run new <${TYPES.join('|')}> "Titel" [projekt-slug]`);
  process.exit(1);
}

const slugify = (s) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .split('-').slice(0, 8).join('-');

const today = new Date().toISOString().slice(0, 10);
const year = today.slice(0, 4);
const slug = slugify(title);
const root = path.resolve(import.meta.dirname, '..', 'src', 'content');
const t = JSON.stringify(title);
const DESC = '"TODO: Worum geht es und warum ist es relevant? Klar, konkret, neugierig machend – 70 bis 165 Zeichen."';

const templates = {
  exploration: [path.join(root, 'explorations', slug, 'index.mdx'), `---
title: ${t}
description: ${DESC}
# Die These in 2–4 Sätzen. Wird sichtbar oben angezeigt und von KI-Suche zitiert.
summary: >-
  TODO: Was ist der Gedanke, was ist die Antwort, warum ist das wichtig? Mindestens 120 Zeichen,
  damit Leser und Maschinen sofort verstehen, worum es geht.
kind: essay # essay | theorie | geschichte | analyse | anleitung | notiz
stage: keimling # keimling | wachsend | ausgereift
pubDate: ${today}
draft: true
topics: [unternehmertum]
# projects: [projekt-slug]
keyTakeaways:
  - TODO erste Kernaussage
# faq:
#   - q: Echte Frage?
#     a: Direkte Antwort.
# sources:
#   - { title: Quelle, url: https://… }
# changelog:
#   - { date: ${today}, note: Erste Fassung }
---

Einstieg …

## Erster Gedanke

…
`],
  projekt: [path.join(root, 'projects', slug, 'index.mdx'), `---
title: ${t}
description: ${DESC}
summary: >-
  TODO: Das Projekt in 2–3 Sätzen – welches Problem es löst, wie es funktioniert, wo es steht.
kind: app # app | software | website | plattform | unternehmen | medien | forschung
status: aktiv # idee | aktiv | pausiert | abgeschlossen | verkauft
role: Gründer
started: ${today}
# url: https://…
# links:
#   - { label: App Store, url: https://… }
# icon: ./icon.png
# cover: ./cover.jpg
# coverAlt: …
# color: "#e8e4dc"
size: m # s | m | l
topics: []
# documents:
#   - { title: Pitch Deck, href: /dokumente/${slug}/pitch.pdf, kind: PDF }
order: 50
draft: true
---

Worum es geht …
`],
  thema: [path.join(root, 'topics', `${slug}.mdx`), `---
title: ${t}
description: ${DESC}
definition: TODO – neutrale Ein-Satz-Definition des Begriffs, wie in einem Lexikon formuliert.
position: TODO – deine eigene, zitierfähige These zu diesem Thema. Das, wofür du stehst und was man über dich wiedergeben soll.
since: ${year}
# sameAs: https://de.wikipedia.org/wiki/…
order: 100
---

Erfahrung & Kontext …
`],
  log: [path.join(root, 'log', `${today}-${slug}.md`), `---
date: ${today}
title: ${t}
${extra ? `project: ${extra}` : '# project: projekt-slug'}
# exploration: exploration-slug
---

Kurz und konkret: Was ist passiert, welche Zahl, welche Erkenntnis?
`],
  medium: [path.join(root, 'media', year, `${slug}.md`), `---
title: ${t}
kind: foto # foto | video | podcast | vortrag | interview | dokument
date: ${today}
# image: ./bild.jpg
# imageAlt: …
# href: /media/${year}/datei.mp4
# source: Veranstaltung / Fotograf
# project: projekt-slug
draft: true
---
`],
  presse: [path.join(root, 'press', `${today}-${slug}.md`), `---
outlet: TODO Medium
title: ${t}
date: ${today}
# url: https://…
# project: projekt-slug
draft: true
---

Ein Satz, worum es im Bericht geht (eigene Worte, kein Zitat).
`],
  seite: [path.join(root, 'pages', `${slug}.mdx`), `---
title: ${t}
description: ${DESC}
# noindex: true
draft: true
---

Inhalt …
`],
};

const [file, content] = templates[type];
if (fs.existsSync(file)) { console.error(`✗ Existiert bereits: ${path.relative(process.cwd(), file)}`); process.exit(1); }
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, content);
console.log(`✓ Angelegt: ${path.relative(process.cwd(), file)}`);
