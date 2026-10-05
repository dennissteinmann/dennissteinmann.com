# dennissteinmann.com – Arbeitsanweisungen für KI-Agenten & Entwickler

Persönliche Website von Dennis Steinmann. **Zentrale seines Denkens und seiner Arbeit**:
Explorationen (Langform), alle Projekte als Karten, Medien, Presse, Dokumente, Social-Media-
Steuerung (/studio/). Ziel: dauerhaft auffindbar in Google UND von KI-Assistenten als Experte
empfohlen. Die Seite ist auf **Jahrzehnte** ausgelegt – jede Entscheidung wird daran gemessen.

> Diese Datei gilt für JEDE Codeänderung. Vor Änderungen an Design, URLs, Metadaten oder
> Deployment die jeweilige Doku in `docs/` lesen. Weicht eine Änderung davon ab, wird
> zuerst die Doku angepasst (mit Begründung in `docs/DECISIONS.md`), dann der Code.

## Stack

- **Astro 7** (statisch, `output: static`), MDX, Content Collections mit Zod-Schemas
- Node ≥ 22 (`.nvmrc`), keine UI-Frameworks, kein Tailwind – eigenes Token-CSS
- Schriften selbst gehostet via `@fontsource` (DSGVO: keine Google-Fonts-Requests)
- Social-/OG-Bilder: `satori` + `@resvg/resvg-js` zur Build-Zeit
- Deploy: GitHub Actions → rsync/SSH auf CloudPanel (`docs/DEPLOYMENT.md`)

## Befehle

```bash
npm run dev          # lokal: http://localhost:4321 (Entwürfe sichtbar)
npm run build        # astro check + Build nach dist/
npm run check:seo    # SEO-Smoke-Test über dist/ (läuft auch in CI)
npm run verify       # build + check:seo – vor jedem Push ausführen
npm run new exploration "Titel"   # auch: projekt | thema | log | medium | presse | seite
```

## Nicht verhandelbare Regeln

### 1. URLs sind ein Vertrag (→ `docs/SEO.md`)
- Muster: `/explorationen/<slug>/`, `/projekte/<slug>/`, `/themen/<slug>/`, `/medien/`, `/presse/`, `/<seite>/`, `/logbuch/`
- Kleinbuchstaben, Bindestriche, **Slash am Ende**, **kein Datum im Pfad**, deutsch.
- Ein veröffentlichter Slug (= Ordnername) wird **nie** geändert. Falls unvermeidbar:
  301-Redirect in `docs/DEPLOYMENT.md` → nginx-Abschnitt eintragen.
- Die JSON-LD-`@id`s (`/#person`, `/#website`) nie ändern.

### 2. Design nur über Tokens (→ `docs/DESIGN.md`)
- Farben, Schriften, Abstände, Radien, Animationen ausschließlich via `var(--…)` aus
  `src/styles/tokens.css`. Keine Hex-Werte, keine px-Schriftgrößen in Komponenten.
- Stil „Daylight Technocracy“ (v3, Anthropic-warm): warmes **Bone**-Grundgerüst (`--bg`, kein
  kaltes Weiß), **Grotesk** (Archivo) als Maschine (Wortmarke, Navigation, Titel – Caps, eng),
  **EB Garamond** als menschliche Stimme (Leads, Langform). Farbe kommt primär aus **Fotografie/
  Video** (`MediaBand`) und warmen Bühnen `.stage--bone/kraft/clay/ink`; Akzent `--clay` sparsam.
- Zwei Schriften: **Archivo** (`--grotesk`/`--sans`) und **EB Garamond** (Serif-Stimme). Keine dritte.
- **Erlaubt (v3):** warmes Bone + erdiges Clay/Terrakotta, Bild-/Video-Bühnen, ruhige Scroll-
  Einblendungen (`[data-reveal]`) und Hover-Bewegung. Medien-Leitfaden: `docs/MEDIA.md`.
- **Weiterhin verboten:** Neon-/grelles Orange („KI-Akzent“), Eyebrow-/Kicker-Texte, Status-/
  Live-Dots, Marquees, Filmkorn, Schatten, UI-Verläufe/Glassmorphism, Mono-Deko, Emojis,
  Icon-Libraries. (Bild-Overlay-Verlauf für Textlesbarkeit ist ok.) Vollständig: `docs/DESIGN.md` §2.
- Farbe kommt aus Palette-Tokens, Medien und Projektfarben – nie frei erfunden/Neon.
- Neue Seiten verwenden `BaseLayout` + `PageHeader`; Sektionen: Titel links, Inhalt rechts.

### 3. Jede Seite ist SEO- & KI-fähig (→ `docs/SEO.md`)
- Metadaten nur über `BaseLayout`-Props → `SEO.astro`. Keine eigenen `<meta>`-Tags.
- Genau **eine `<h1>`** pro Seite, logische `h2`/`h3`-Hierarchie.
- Jede neue indexierbare Route muss in `src/lib/urls.ts` auftauchen (Sitemap + llms.txt).
- Strukturierte Daten über `src/lib/seo.ts` (Person, WebSite, BlogPosting, Breadcrumbs …).
- Bilder immer mit sinnvollem `alt` (dekorativ: `alt=""`), über `astro:assets`.
- Keine Third-Party-Skripte, kein Tracking, keine Cookie-Banner-Pflicht erzeugen.

### 4. Inhalte liegen als Dateien im Repo (→ `docs/CONTENT.md`)
- Explorationen: `src/content/explorations/<slug>/index.mdx` + Bilder im selben Ordner.
- Expertise = Themen-Dateien (`src/content/topics/`) mit `definition` + `position`.
- Schemas in `src/content.config.ts` erzwingen Description-Länge, Summary, Tags usw.
  **Schema-Fehler nicht durch Aufweichen des Schemas lösen**, sondern den Inhalt fixen.
- Identität, Navigation, Profile: nur in `src/site.config.ts`.

### 5. Qualität vor dem Push
- `npm run verify` muss grün sein (0 Typfehler, SEO-Check bestanden).
- Neue Features → passende Doku in `docs/` aktualisieren. Architekturentscheidung →
  Eintrag in `docs/DECISIONS.md`.
- Push auf `main` deployed **sofort live**. Unfertiges als `draft: true` markieren.

## Projektstruktur

```
src/
  site.config.ts        Identität, Navigation, Profile (Single Source of Truth)
  content.config.ts     Schemas: explorations, projects, topics, media, press, log, pages
  content/              Alle Inhalte (MDX/MD + Bilder)
  styles/tokens.css     Design-Tokens (einzige Quelle für Werte)
  styles/global.css     Basis, Utilities, Raster
  styles/prose.css      Langform-Typografie
  lib/content.ts        Abfragen, Lesezeit, Nummerierung, Themen
  lib/seo.ts            JSON-LD-Bausteine
  lib/urls.ts           Liste aller indexierbaren URLs
  lib/og.ts, social.ts  OG-Bilder & Social-Carousels
  components/           UI-Bausteine; components/mdx/ = in MDX ohne Import nutzbar
  layouts/BaseLayout    <html>, <head>, Header, Footer
  pages/                Routen (inkl. sitemap.xml, robots.txt, llms.txt, rss.xml, og/, social/, studio/)
docs/                   DESIGN, SEO, CONTENT, SOCIAL, MEDIA, CMS, DEPLOYMENT, DECISIONS, moodboard/
public/admin/           Sveltia CMS (git-basiert, noindex) – Inhalte pflegen, siehe docs/CMS.md
scripts/                new.mjs (Content-CLI), check-dist.mjs (SEO-Check)
```

## Offene TODOs von Dennis (vor Livegang)

- `src/site.config.ts` → `CHANNELS`: echte Profil-URLs (LinkedIn, Instagram, …)
- Importierte Projekte prüfen (59 Stück, Quelle als Kommentar im MDX; Entwürfe ergänzen)
- Themen-Positionen in eigenen Worten schärfen (`src/content/topics/*.mdx`)
- `src/content/pages/impressum.mdx`, `kontakt.mdx`, `datenschutz.mdx`: echte Angaben
- `src/content/pages/ueber.mdx`: Text in eigenen Worten
- GitHub-Secrets für Deploy setzen (`docs/DEPLOYMENT.md`)
