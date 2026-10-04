# Inhalte pflegen

Alle Inhalte sind Dateien in `src/content/`. Kein CMS – versioniert, portabel, in 20 Jahren lesbar.

## Schnellstart

```bash
npm run dev                                         # http://localhost:4321
npm run new exploration "Warum kleine Apps gewinnen"
npm run new projekt "Meine App"
npm run new thema "Produktdesign"
npm run new log "Version 1.2 ist live" meine-app
npm run new medium "Vortrag auf der XY-Konferenz"
npm run new presse "Interview im Magazin XY"
npm run new seite "Uses"
```

Neue Explorationen, Projekte und Seiten starten als `draft: true` → lokal sichtbar, live unsichtbar.

## Typen

| Typ | Ort | URL | Wofür |
|---|---|---|---|
| Exploration | `explorations/<slug>/index.mdx` | `/explorationen/<slug>/` | Langform-Gedanken, Theorien, Geschichten (Kern) |
| Projekt | `projects/<slug>/index.mdx` | `/projekte/<slug>/` | Hub je Projekt inkl. Dokumente |
| Thema | `topics/<slug>.mdx` | `/themen/<slug>/` | Experten-Hub: Definition + Position |
| Medium | `media/<jahr>/<slug>.md` | `/medien/` | Foto, Video, Podcast, Vortrag, Interview |
| Presse | `press/<datum>-<slug>.md` | `/presse/` | Berichterstattung über dich |
| Logbuch | `log/<datum>-<slug>.md` | `/logbuch/#log-…` | kurze Notiz |
| Seite | `pages/<slug>.mdx` | `/<slug>/` | freie Unterseiten |

## Explorationen

| Feld | Pflicht | Hinweis |
|---|---|---|
| `title` | ✓ | 5–80 Zeichen |
| `description` | ✓ | 70–165 Zeichen – Such-Snippet |
| `summary` | ✓ | 120–600 Zeichen – die These, sichtbar oben, für KI-Suche |
| `kind` | | `essay` · `theorie` · `geschichte` · `analyse` · `anleitung` · `notiz` |
| `stage` | | `keimling` · `wachsend` · `ausgereift` – Gedanken dürfen wachsen |
| `pubDate` / `updated` | ✓ / | `updated` bei substanzieller Überarbeitung |
| `changelog` | | `- { date: 2026-11-01, note: "Abschnitt zu X ergänzt" }` |
| `topics` | ✓ | 1–5 Themen-Slugs aus `src/content/topics/` |
| `projects` | | Projekt-Slugs |
| `keyTakeaways`, `faq`, `sources` | | Kernaussagen, Fragen, Quellen (→ Zitate im Schema) |
| `cover` / `coverAlt` | | Titelbild im selben Ordner |
| `social` | | Carousel-Steuerung, siehe docs/SOCIAL.md |
| `distribution` | | Wo gepostet: `- { channel: linkedin, url: …, date: … }` |

## Projekte

`kind` bestimmt das Kartendesign: `app` (Icon auf Farbfläche) · `website` / `software` /
`plattform` (Screenshot oder Domain) · `unternehmen` (Wortmarke) · `medien` / `forschung` (Hochformat-Cover).

| Feld | Hinweis |
|---|---|
| `icon` | quadratisches Logo/App-Icon (`./icon.png`, ≥ 512 px) |
| `cover` | Screenshot/Bild (`./cover.jpg`, ~1800 px, JPG) |
| `color` | Markenfarbe des Projekts `#rrggbb` – färbt nur dessen Karte |
| `size` | `s` · `m` · `l` – Gewicht im Projektfeld |
| `links` | `- { label: App Store, url: … }` |
| `documents` | Dateien für Projekte ohne eigene Website, siehe unten |
| `order` | kleiner = weiter vorn |

### Dokumente

PDFs, Decks, Whitepaper nach `public/dokumente/<projekt>/` legen und eintragen:

```yaml
documents:
  - { title: Pitch Deck, href: /dokumente/meine-app/pitch.pdf, kind: PDF, date: 2026-05-01 }
```

Sie erscheinen auf der Projektseite und gesammelt unter `/medien/`.

## Themen (Experten-Hubs)

```yaml
title: Produktdesign
description: (70–165 Zeichen)
definition: Neutrale Ein-Satz-Definition des Begriffs.
position: Deine eigene, zitierfähige These – das, was KI-Assistenten über dich wiedergeben sollen.
since: 2019
sameAs: https://de.wikipedia.org/wiki/Produktdesign
```

## Bilder & Medien

Bilder liegen beim Inhalt (`./bild.jpg`) und werden automatisch optimiert. Große Bilder als JPG.
Videos/PDFs/Downloads → `public/media/<jahr>/…` bzw. `public/dokumente/…`.

```mdx
<Figure src={import('./bild.jpg')} alt="…" caption="…" wide />
<Callout title="Learning">Text</Callout>
<Stats items={[{ value: '300.000', label: 'Downloads / Monat' }]} />
<Video src="/media/2026/demo.mp4" caption="…" />
```

**YAML-Falle:** Werte mit `: ` in Anführungszeichen setzen.
