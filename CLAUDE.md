# dennissteinmann.com – Arbeitsanweisungen für KI-Agenten & Entwickler

Persönliche Website von Dennis Steinmann. **Zentrale der Personal Brand**: Jeder Inhalt
erscheint zuerst hier als Langform, danach wird er zu Social-Media-Content. Die Seite ist
auf **Jahrzehnte** ausgelegt – jede Entscheidung wird daran gemessen.

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
npm run new artikel "Titel"   # auch: projekt | log | seite
```

## Nicht verhandelbare Regeln

### 1. URLs sind ein Vertrag (→ `docs/SEO.md`)
- Muster: `/artikel/<slug>/`, `/projekte/<slug>/`, `/themen/<tag>/`, `/<seite>/`, `/logbuch/`
- Kleinbuchstaben, Bindestriche, **Slash am Ende**, **kein Datum im Pfad**, deutsch.
- Ein veröffentlichter Slug (= Ordnername) wird **nie** geändert. Falls unvermeidbar:
  301-Redirect in `docs/DEPLOYMENT.md` → nginx-Abschnitt eintragen.
- Die JSON-LD-`@id`s (`/#person`, `/#website`) nie ändern.

### 2. Design nur über Tokens (→ `docs/DESIGN.md`)
- Farben, Schriften, Abstände, Radien, Animationen ausschließlich via `var(--…)` aus
  `src/styles/tokens.css`. Keine Hex-Werte, keine px-Schriftgrößen in Komponenten.
- Drei Schriften, feste Rollen: **Instrument Serif** = Headlines, **Inter Tight** =
  Text/UI/Wortmarke, **JetBrains Mono** = Metadaten/Labels. Keine weiteren Schriften.
- Ein Akzent pro Ansicht dominant: Signal-Orange. Lime nur für Highlights/Kennzahlen.
- Kanten statt Rundungen, Haarlinien statt Schatten, Mono-Nummerierung (01, 02, № 001).
- Beide Themes (dunkel = Standard, hell = „Papier“) müssen funktionieren.
- Neue Seiten verwenden `BaseLayout` + `PageHeader`; neue Sektionen `section-head`.

### 3. Jede Seite ist SEO- & KI-fähig (→ `docs/SEO.md`)
- Metadaten nur über `BaseLayout`-Props → `SEO.astro`. Keine eigenen `<meta>`-Tags.
- Genau **eine `<h1>`** pro Seite, logische `h2`/`h3`-Hierarchie.
- Jede neue indexierbare Route muss in `src/lib/urls.ts` auftauchen (Sitemap + llms.txt).
- Strukturierte Daten über `src/lib/seo.ts` (Person, WebSite, BlogPosting, Breadcrumbs …).
- Bilder immer mit sinnvollem `alt` (dekorativ: `alt=""`), über `astro:assets`.
- Keine Third-Party-Skripte, kein Tracking, keine Cookie-Banner-Pflicht erzeugen.

### 4. Inhalte liegen als Dateien im Repo (→ `docs/CONTENT.md`)
- Artikel: `src/content/articles/<slug>/index.mdx` + Bilder im selben Ordner.
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
  content.config.ts     Schemas: articles, projects, log, pages
  content/              Alle Inhalte (MDX/MD + Bilder)
  styles/tokens.css     Design-Tokens (einzige Quelle für Werte)
  styles/global.css     Basis, Utilities, Buttons, Raster
  styles/prose.css      Langform-Typografie
  lib/content.ts        Abfragen, Lesezeit, Nummerierung, Themen
  lib/seo.ts            JSON-LD-Bausteine
  lib/urls.ts           Liste aller indexierbaren URLs
  lib/og.ts, social.ts  OG-Bilder & Social-Carousels
  components/           UI-Bausteine; components/mdx/ = in MDX ohne Import nutzbar
  layouts/BaseLayout    <html>, <head>, Header, Footer
  pages/                Routen (inkl. sitemap.xml, robots.txt, llms.txt, rss.xml, og/, social/)
docs/                   DESIGN, SEO, CONTENT, SOCIAL, DEPLOYMENT, DECISIONS, moodboard/
scripts/                new.mjs (Content-CLI), check-dist.mjs (SEO-Check)
```

## Offene TODOs von Dennis (vor Livegang)

- `src/site.config.ts` → `PERSON.sameAs`: echte Profil-URLs (LinkedIn, Instagram, …)
- `src/content/pages/impressum.mdx`, `kontakt.mdx`, `datenschutz.mdx`: echte Angaben
- `src/content/pages/ueber.mdx`: Text in eigenen Worten
- GitHub-Secrets für Deploy setzen (`docs/DEPLOYMENT.md`)
