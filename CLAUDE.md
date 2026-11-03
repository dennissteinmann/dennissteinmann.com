# dennissteinmann.com – Arbeitsanweisungen für KI-Agenten & Entwickler

Persönliche Website von Dennis Steinmann. **Derzeit bewusst minimal: eine Seite mit seinen
Projekten**, gespeist aus **einer einzigen Datei: `INHALT.md`** (siehe `docs/DECISIONS.md`,
2026-10-29). Weitere Bereiche (Explorationen, Themen, Medien, Presse, Über) sind vorübergehend
offline, ihre Inhalte bleiben im Repo. Ziel: dauerhaft auffindbar in Google UND von
KI-Assistenten empfohlen. Die Seite ist auf **Jahrzehnte** ausgelegt.

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
```

**Inhalte ändern = `INHALT.md` bearbeiten** (Format steht oben in der Datei, Details in
`docs/CONTENT.md`). Speichern auf `main` → nach ca. 1 Minute live.

## Nicht verhandelbare Regeln

### 1. URLs sind ein Vertrag (→ `docs/SEO.md`)
- Aktuell online: `/`, `/kontakt/`, `/impressum/`, `/datenschutz/`. Projekte als Anker `/#<projekt>`.
  Vorübergehend offline (Muster bleiben reserviert): `/explorationen/<slug>/`, `/projekte/<slug>/`,
  `/themen/<slug>/`, `/medien/`, `/presse/`, `/logbuch/`, `/ueber/`.
- Kleinbuchstaben, Bindestriche, **Slash am Ende**, **kein Datum im Pfad**, deutsch.
- Ein veröffentlichter Slug (= Ordnername) wird **nie** geändert. Falls unvermeidbar:
  301-Redirect in `docs/DEPLOYMENT.md` → nginx-Abschnitt eintragen.
- Die JSON-LD-`@id`s (`/#person`, `/#website`) nie ändern.

### 2. Design nur über Tokens (→ `docs/DESIGN.md`)
- Farben, Schriften, Abstände, Radien, Animationen ausschließlich via `var(--…)` aus
  `src/styles/tokens.css`. Keine Hex-Werte, keine px-Schriftgrößen in Komponenten.
- Stil „Weißes Kontor“ (v5, Privatclub-Struktur in Bauhaus-Sprache): reines **Weiß** (`--paper`),
  Blauschwarz-**Tinte** (`--ink`), **Marineblau** als Hausfarbe (nur Kontakt + Fußzeile),
  **Messing** (`--brass`) als einziger Akzent. Wortmarke & Sektionstitel als gesperrte Versalien
  (`.mark`/`.khead`), Etiketten `.label`. Wappen als Signet, Zierlinie `.rule--double`,
  Sektionslinie `.sec--ruled`. Medien-Leitfaden: `docs/MEDIA.md`.
- **Eine Schrift: Jost** (`--font`, geometrische Grotesk). **Keine Serifen**, keine zweite Schrift.
- **Keine Serifen, keine Rundungen, keine Schatten** – nirgends. CI bricht ab (`scripts/check-dist.mjs`).
- **Verboten:** Neon/gesättigte UI-Farben, Eyebrow-/Kicker-Texte, Status-/Live-Dots, Marquees,
  Filmkorn, UI-Verläufe/Glassmorphism, Mono-Deko, Emojis, Icon-Libraries, Buttons mit
  Rahmen/Füllung, Hover-Verschiebungen, Duzen im Interface (Sie-Form). Bild-Abdunklung
  (`--scrim`) für Textlesbarkeit ist ok. Vollständig: `docs/DESIGN.md` §2.
- Farbe kommt aus Palette-Tokens, Medien und Projektfarben – nie frei erfunden/Neon.
  Bühnen-Werte nur aus Primitiven `--c-*` (sonst CSS-Variablen-Zyklus).
- Neue Seiten verwenden `BaseLayout` + `PageHeader`; Sektionen: Titel links, Inhalt rechts.

### 3. Jede Seite ist SEO- & KI-fähig (→ `docs/SEO.md`)
- Metadaten nur über `BaseLayout`-Props → `SEO.astro`. Keine eigenen `<meta>`-Tags.
- Genau **eine `<h1>`** pro Seite, logische `h2`/`h3`-Hierarchie.
- Jede neue indexierbare Route muss in `src/lib/urls.ts` auftauchen (Sitemap + llms.txt).
- Strukturierte Daten über `src/lib/seo.ts` (Person, WebSite, BlogPosting, Breadcrumbs …).
- Bilder immer mit sinnvollem `alt` (dekorativ: `alt=""`), über `astro:assets`.
- Keine Third-Party-Skripte, kein Tracking, keine Cookie-Banner-Pflicht erzeugen.

### 4. Inhalt = eine Datei (→ `docs/CONTENT.md`)
- **`INHALT.md`** ist die einzige Inhaltsquelle der Website: Name, Tätigkeit, Profile, Projekte,
  weitere Abschnitte. Parser: `src/lib/inhalt.ts` (Fehler → Build bricht mit Zeilenangabe ab).
- `src/site.config.ts` leitet Identität & Profile aus `INHALT.md` ab; dort nur Technisches
  (URL, Sprache, Navigation). Rechtstexte: `src/content/pages/` (Impressum, Datenschutz, Kontakt).
- `src/content/*` (Explorationen, Projekte, Themen …) ist **Archiv** – wird derzeit nicht gebaut.
  Schemas dort trotzdem nie aufweichen.

### 5. Qualität vor dem Push
- `npm run verify` muss grün sein (0 Typfehler, SEO-Check bestanden).
- Neue Features → passende Doku in `docs/` aktualisieren. Architekturentscheidung →
  Eintrag in `docs/DECISIONS.md`.
- Push auf `main` deployed **sofort live**. Unfertiges in `INHALT.md` als Kommentar
  (`<!-- … -->`) stehen lassen – Kommentare erscheinen nie auf der Website.

## Projektstruktur

```
INHALT.md               DER Inhalt der Website (eine Datei)
src/
  site.config.ts        Technik + aus INHALT.md abgeleitete Identität/Profile
  lib/inhalt.ts         Parser für INHALT.md
  content.config.ts     Schemas: explorations, projects, topics, media, press, log, pages
  content/pages/        Rechtstexte & Kontakt (Impressum, Datenschutz, Kontakt)
  content/…             Archiv: Explorationen, Projekte, Themen … (derzeit nicht gebaut)
  styles/tokens.css     Design-Tokens (einzige Quelle für Werte)
  styles/global.css     Basis, Utilities, Raster
  styles/prose.css      Langform-Typografie
  lib/content.ts        Abfragen, Lesezeit, Nummerierung, Themen
  lib/seo.ts            JSON-LD-Bausteine
  lib/urls.ts           Liste aller indexierbaren URLs
  lib/og.ts, social.ts  OG-Bilder & Social-Carousels
  components/           UI-Bausteine; components/mdx/ = in MDX ohne Import nutzbar
  layouts/BaseLayout    <html>, <head>, Header, Footer
  pages/                Routen: index (alles aus INHALT.md), [slug] (Rechtstexte), sitemap.xml, robots.txt, llms.txt, og/default.png
docs/                   DESIGN, SEO, CONTENT, SOCIAL, MEDIA, CMS, DEPLOYMENT, DECISIONS, moodboard/
public/admin/           Sveltia CMS (git-basiert, noindex) – Inhalte pflegen, siehe docs/CMS.md
scripts/                new.mjs (Content-CLI), check-dist.mjs (SEO-Check)
```

## Offene TODOs von Dennis (vor Livegang)

- `INHALT.md`: Projekte aus LinkedIn übernehmen (Vorbefüllung prüfen), Profile ergänzen
- `INHALT.md`: optional „Werdegang“ und „Über mich“ füllen (leer = ausgeblendet)
- `src/content/pages/datenschutz.mdx`: Hoster eintragen, juristisch prüfen (Impressum & Kontakt-E-Mail gepflegt)
- CloudPanel-Vhost: `Cache-Control "no-cache"` für HTML übernehmen (`docs/DEPLOYMENT.md`)
