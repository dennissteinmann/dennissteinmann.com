# Designsystem – „Cinematic Editorial Heritage“

Das Design übersetzt Dennis' Moodboard in ein durchgängiges System. Ziel: **modern,
künstlerisch, technisch** – und so klar strukturiert, dass jede neue Seite automatisch
dazupasst. Alle Werte leben in [`src/styles/tokens.css`](../src/styles/tokens.css).

## 1. Moodboard → Entscheidungen

Referenzbilder liegen in [`docs/moodboard/`](moodboard/) (komprimiert). Originale:
`SmartOps/Persönlich/Pers. Branding/Neu` und `SmartOps/Projekte/Personal Branding/Dennis Steinmann`.

| Referenz | Was wir daraus nehmen | Wo im System |
|---|---|---|
| `gradatim-banner.jpg` – fast schwarzer Banner, unscharfes Porträt, Wappen + „Gradatim Ferociter“ in Sperrsatz | Dunkles Standard-Theme (`--c-ink-950`), Motto als Markenkern, gesperrte Versalien | Header-Motto, Footer-Motto, `.kicker` |
| `wappen.jpg` – heraldischer Löwe mit Kreuz & Lilien | Wappen als Signet: Header, Favicon, Footer, Manifest, Social-Grafiken. Vektorisiert (`src/assets/brand/crest.svg`), nimmt `currentColor` an | `Crest.astro`, `public/favicon.svg` |
| `logo-steinmann.jpg` – Pop-Art-Landschaft, fette Grotesk „STEINMANN“ | Wortmarke in Inter Tight 800 Versalien; **Signal-Orange** der Sonne/des Himmels als Primärakzent; See-Blau/Grün nur für Illustration & Diagramme | `.wordmark`, `--c-signal-500`, `--c-lake-400` |
| `linkedin-carousel-*.jpg` – Creme-Hintergrund, schmale Serif-Headline, Lime-Kennzahlkacheln | Helles Theme „Papier“ (`--c-paper-100`), **Instrument Serif** für Headlines, **Lime** für Kennzahlen/Highlights | Light-Theme, `<Stats>`, Takeaway-Box, Carousel-Folien |
| `golden-hour-artikel.jpg` – kinematografisches Goldlicht, dunkle Stadt | Warmer Gold-Glow als Verlauf (nie flächig), Filmkorn-Overlay, warme statt kalte Grautöne | `.hero__glow`, `body::after` (Grain), `--c-stone-*` |
| `build-your-name-poster.jpg` – Art-Déco, Navy + Gold, „The Long Term Asset of a Personal Brand“ | Haltung: Langfristigkeit, Vermächtnis. Navy als Reservefarbe; Gold als Licht | Markenbotschaft, `--c-navy-900`, `--c-gold-400` |
| `slogan.jpg` – Navy-Verlauf, „… aber was ist, wenn es funktioniert?“ | Tonalität: optimistisch, direkt, persönlich | Copywriting |
| `alte-autorbox.jpg` – rundes Porträt, Name, Rolle | Autorbox unter Artikeln (E-E-A-T-Signal) | `artikel/[slug].astro` |

## 2. Die fünf Prinzipien

1. **Editorial vor App.** Große Serif-Headlines, Satzspiegel 68ch, Haarlinien. Keine
   Karten mit Schatten, keine runden Ecken (`--radius-0`), keine Icon-Flut.
2. **Technik sichtbar machen.** Mono-Metadaten, Nummerierung (`01`, `№ 001`), sichtbares
   12-Spalten-Raster (`.grid-lines`), Fortschrittsbalken beim Lesen.
3. **Kinematografisches Licht.** Dunkel als Bühne, Gold-/Orange-Glow als einzige
   Lichtquelle, analoges Filmkorn darüber.
4. **Ein Akzent.** Signal-Orange führt das Auge (Links, Nummern, Kursiv-Akzente). Lime
   ist das Textmarker-Werkzeug – sparsam.
5. **Heraldik als Signatur.** Wappen und Unterschrift sind die „Handschrift“ – sie
   tauchen an festen Stellen auf, nicht dekorativ überall.

## 3. Tokens (Auszug)

| Rolle | Token | Dunkel | Hell |
|---|---|---|---|
| Hintergrund | `--bg` | `#0b0b0a` | `#f3efe6` |
| Text | `--fg` | `#f3efe6` | `#1a1916` |
| Sekundärtext | `--fg-muted` | `#8f897e` | `#6b665c` |
| Linien | `--line` / `--line-strong` | 11 % / 24 % Papier | 12 % / 28 % Tinte |
| Akzent | `--accent` | `#ec4a2a` | `#c93a1d` |
| Highlight | `--highlight` | `#d8f36a` | `#d8f36a` |
| Licht | `--glow` | `#e2b25a` | `#c98f2e` |

**Typografie** – fluide Skala `--step--2` … `--step-6` (clamp, 360→1440 px).

| Rolle | Schrift | Einsatz |
|---|---|---|
| Display | Instrument Serif 400 / *Italic* | `h1`, `h2`, Zitate, große Zahlen. Kursiv = Akzentfarbe |
| Sans | Inter Tight Variable | Fließtext, UI, `h3`, Wortmarke (800, Versalien) |
| Mono | JetBrains Mono Variable | Kicker, Datum, Lesezeit, Nummern, Buttons, Captions |

**Raum** – 4-px-Basis `--space-1…10`, Seitenrand `--gutter`, Container 1320 px,
Lesespalte `--measure` 68ch.

## 4. Komponenten-Inventar

| Komponente | Zweck |
|---|---|
| `BaseLayout` | Pflicht für jede Seite: Head/SEO, Theme-Init, Header, Footer |
| `PageHeader` | Kopf jeder Übersichts-/Unterseite (Breadcrumbs, Kicker, h1, Lead) |
| `.section` + `.section-head` | Abschnitt mit Nummer · Titel · Aktion |
| `ArticleCard` (`row`/`feature`) | Artikel in Listen |
| `ProjectCard` | Projekt mit Status-Punkt |
| `LogList` | Logbuch-Einträge (mit Anker `#log-…`) |
| `Breadcrumbs`, `Crest` | Navigation, Signet |
| MDX: `Figure`, `Callout`, `Stats`, `Video` | Autoren-Bausteine, ohne Import in MDX nutzbar |
| Utilities | `.display .h-xxl…h-s .kicker .lead .mono .highlight .btn .btn--accent .arrow-link .tag .status` |

## 5. Do & Don't

- ✅ Neue Farbe nötig? Erst prüfen, ob ein semantischer Token passt. Sonst in
  `tokens.css` ergänzen **und** hier dokumentieren.
- ✅ Headlines dürfen *ein* kursives Wort in Akzentfarbe haben (`<em>`).
- ✅ Bilder: kantig, Haarlinie-Rahmen, Porträts gerne s/w mit Farbe on hover.
- ❌ Keine Schatten, Verläufe auf Flächen, Glassmorphism-Karten oder Emojis im UI.
- ❌ Keine zusätzlichen Webfonts, keine Icon-Libraries, keine CSS-Frameworks.
- ❌ Kein Hex-Wert außerhalb `tokens.css` (Ausnahme: `src/lib/og.ts` spiegelt die Palette,
  weil satori keine CSS-Variablen kennt – bei Änderungen beide Stellen anpassen).

## 6. Barrierefreiheit

Kontraste AA in beiden Themes, sichtbarer Fokus (`--highlight`-Outline), Skip-Link,
`prefers-reduced-motion` respektiert (Reveal, Marquee, Smooth-Scroll aus), semantische
Landmarks (`header`, `nav`, `main`, `footer`), Navigation per Tastatur bedienbar.
