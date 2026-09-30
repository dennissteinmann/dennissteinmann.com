# Inhalte pflegen

Alle Inhalte sind Dateien in `src/content/`. Kein CMS, keine Datenbank – dafür
versioniert, portabel und in 20 Jahren noch lesbar.

## Schnellstart

```bash
npm run dev                                   # Vorschau auf http://localhost:4321
npm run new artikel "Wie ich meine erste App verkauft habe"
npm run new projekt "Meine App"
npm run new log "Version 1.2 ist live" meine-app
npm run new seite "Uses"
```

Neue Artikel starten als `draft: true` → lokal sichtbar (mit „Entwurf“-Markierung),
im Live-Build unsichtbar. Zum Veröffentlichen `draft: false` setzen, committen, pushen.

## Typen

| Typ | Ort | URL | Wofür |
|---|---|---|---|
| Artikel | `articles/<slug>/index.mdx` | `/artikel/<slug>/` | Langform (Kern der Seite) |
| Projekt | `projects/<slug>/index.mdx` | `/projekte/<slug>/` | Hub je Projekt |
| Logbuch | `log/<datum>-<slug>.md` | `/logbuch/#log-…` | kurze Fortschrittsnotiz |
| Seite | `pages/<slug>.mdx` | `/<slug>/` | freie Unterseiten (Über, Kontakt, Uses …) |

Unterseite in die Navigation aufnehmen: `NAV` oder `FOOTER_NAV` in `src/site.config.ts`.

## Medien

**Bilder gehören zum Inhalt**: in den Ordner des Artikels/Projekts legen.

```
src/content/articles/meine-erste-app/
  index.mdx
  cover.jpg          ← Titelbild (frontmatter: cover: ./cover.jpg + coverAlt)
  dashboard.png      ← im Text verwendet
```

Im Text:

```mdx
![Umsatz-Dashboard im März](./dashboard.png)

<Figure src={import('./dashboard.png')} alt="Umsatz-Dashboard im März" caption="Abb. 2 — App Store Connect, März 2026" wide />
```

Astro erzeugt automatisch AVIF/WebP in mehreren Größen – Originale einfach in voller
Qualität ablegen (ideal: JPG/PNG, 1600–2400 px breit, < 5 MB).

**Videos, PDFs, Downloads** (werden nicht optimiert) → `public/media/<jahr>/…`,
eingebunden mit absolutem Pfad `/media/2026/demo.mp4`. Videos als MP4 (H.264),
max. ~20 MB; größere Videos auf YouTube und nur verlinken.
Dateinamen: Kleinbuchstaben, Bindestriche, sprechend (`app-onboarding-demo.mp4`).

## MDX-Bausteine (ohne Import nutzbar)

```mdx
<Callout type="lesson" title="Learning">Text</Callout>   // note | warn | lesson
<Stats items={[{ value: '300.000', label: 'Downloads / Monat' }, { value: '$5.000', label: 'Umsatz / Monat' }]} />
<Figure src={import('./bild.jpg')} alt="…" caption="…" wide />
<Video src="/media/2026/demo.mp4" poster="/media/2026/demo.jpg" caption="…" />
```

Neue Bausteine → `src/components/mdx/` + in `index.ts` registrieren + hier dokumentieren.

## Frontmatter-Referenz (Artikel)

| Feld | Pflicht | Hinweis |
|---|---|---|
| `title` | ✓ | 10–80 Zeichen |
| `seoTitle` | | abweichender `<title>` |
| `description` | ✓ | 70–165 Zeichen – Such-Snippet |
| `summary` | ✓ | 120–600 Zeichen – sichtbare Kurzfassung, für KI-Suche |
| `pubDate` | ✓ | `2026-09-30` |
| `updated` | | bei substanzieller Überarbeitung setzen |
| `draft` | | `true` = nicht live |
| `tags` | ✓ | 1–6 Slugs, z. B. `mobile-apps` (Anzeigenamen in `src/lib/content.ts`) |
| `project` | | Slug eines Projekts → erscheint auf dessen Hub-Seite |
| `cover` / `coverAlt` | | Titelbild; `coverAlt` Pflicht wenn `cover` |
| `keyTakeaways` | | 3–7 Kernaussagen (Box + Carousel) |
| `faq` | | `- q: … / a: …` → FAQ-Box + FAQPage-Schema |
| `social` | | `hook`, `slides`, `cta`, `caption` → siehe `docs/SOCIAL.md` |
| `canonical` | | nur wenn zuerst woanders erschienen |

**YAML-Falle:** Enthält ein Wert `: ` (Doppelpunkt + Leerzeichen), in Anführungszeichen setzen.

## Schreibstil

- Ich-Perspektive, konkret, ehrlich, mit Zahlen. Keine Floskeln.
- Erster Absatz: worum geht es und warum jetzt. Zwischenüberschriften, die man einzeln
  zitieren könnte. Kurze Absätze (2–4 Sätze).
- Auf ältere Artikel und Projektseiten verlinken (interne Verlinkung = SEO-Rückgrat).
