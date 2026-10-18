# Designsystem v4 – „Kontor“

Hanseatisch, institutionell, ruhig. Die Seite soll wirken wie das Haus eines privaten
Industrie- oder Überseeclubs, einer Privatbank oder eines alten Hamburger Handelshauses:
**Büttenpapier, Tinte, Marineblau, Messing. Gravierte Garamond-Versalien, Wappen,
Zierlinien, strenge Register. Keine Rundungen.** Vertrauen entsteht durch Ordnung,
Zurückhaltung und Fakten – nicht durch Effekte. Alle Werte:
[`src/styles/tokens.css`](../src/styles/tokens.css). Medien-Leitfaden:
[`docs/MEDIA.md`](MEDIA.md). Begründung & Abgrenzung zu v3 „Daylight Technocracy“:
`docs/DECISIONS.md` (2026-10-18). Mechanik siehe §7.

## 1. Referenzen

| Referenz | Was wir daraus nehmen |
|---|---|
| Übersee-Club Hamburg, private Industrie-Clubs | Marineblau + Elfenbein, Wappen als Signet, Versalien-Wortmarke, nüchterne Register statt Werbung |
| Hamburger Privatbanken & Handelshäuser (Briefkopf, Geschäftsbericht) | Zierlinie (kräftig über fein), Registerauszug-Tabellen, Sie-Form, „Stand“-Angaben |
| Gravur, Messingschild, Visitenkarte | Gesperrte Garamond-Versalien für Name und Sektionstitel, Messing als einziger Akzent |
| `docs/moodboard/v1/wappen.jpg` | Wappen (Löwe, Kreuz, Lilien) als zentrales Signet: Kopfzeile, Startseite, Fußzeile, Favicon, OG |

## 2. Verbote (verbindlich)

Diese Muster sind unerwünscht – sie wirken laut, billig oder nach „typischem KI-Webdesign“:

- ❌ **Rundungen jeder Art** (`border-radius` ≠ 0) – auch nicht für Bilder, Avatare, Icons,
  Buttons. Ecken sind rechtwinklig. Wird in CI geprüft (`scripts/check-dist.mjs`).
- ❌ **Schatten** (`box-shadow`) – ebenfalls in CI geprüft.
- ❌ Neon-/grelles Orange, gesättigte UI-Farben. Farbe = Marineblau, Messing, Papier, Tinte.
- ❌ Eyebrow-/Kicker-Texte über Überschriften („KAPITEL 01“, „● LIVE“ …)
- ❌ Status-Punkte, pulsierende Dots, Marquees, Filmkorn, Mono-Schrift-Deko
- ❌ Nummerierte Section-Heads, Buttons mit Rahmen/Füllung (Links bleiben Text)
- ❌ UI-Verläufe, Glassmorphism, Emojis, Icon-Libraries (Ausnahme: Bild-Abdunklung `--scrim`
  für Textlesbarkeit über Fotos)
- ❌ Verspielte Bewegung: kein Verschieben bei Hover, kein Zoom über 1.5 %, nichts in Schleife.
- ❌ Duzen in Interface-Texten. Die Seite spricht in **Sie-Form** oder neutral.

**Bewegung** ist still: Scroll-Einblendungen (`[data-reveal]`, minimaler Versatz) und
Unterstreichungen bei Hover. `prefers-reduced-motion` wird respektiert.

## 3. Prinzipien

1. **Ordnung schafft Vertrauen.** Symmetrischer Briefkopf auf der Startseite, darunter strenge
   Register. Projekte in einem gleichmäßigen Katalograster (`ProjectField`), nicht verstreut.
2. **Raster.** 12 Spalten. Sektionen: Titel links (3/12), Inhalt rechts (9/12) – Utility `.sec`.
3. **Zwei Stimmen.** **EB Garamond** ist die Stimme des Hauses: Wortmarke und Sektionstitel als
   gesperrte Versalien (`.mark`, `.khead`), Titel, Leads, Langform. **Archivo** ist nur Funktion:
   Navigation, Meta, Etiketten (`.label`, `.meta`) – klein, Versalien, weit gesperrt. Nie für
   Überschriften. Eine dritte Schrift gibt es nicht.
4. **Papier & Tinte, Marineblau als Hausfarbe.** Grund ist Elfenbein (`--paper`), Text
   Blauschwarz (`--ink`). Marineblau erscheint als vollflächige Bühne (Themen, Kontakt,
   Fußzeile). Messing (`--brass`) ist der einzige Akzent – Zähler, Zierlinien, aktive Navigation.
5. **Linien statt Flächen.** Haarlinien gliedern Register; die **Zierlinie** (`.rule--double`,
   2 px über 1 px) schließt Briefkopf und Seitenköpfe ab, wie im Geschäftsbrief.
6. **Barrierefrei = vertrauenswürdig.** Alle Text-Grautöne erfüllen WCAG AA auf ihrem Grund.

## 4. Tokens

| Rolle | Token | Wert |
|---|---|---|
| Seitengrund | `--paper` (`--bg`) | `#f6f3eb` Elfenbein |
| Tiefere Papierbühne / Passepartout | `--paper-deep` | `#ece6d9` |
| Text | `--ink` | `#14181f` Blauschwarz |
| Fließtext-Nuance | `--ink-soft` | `#3a3f48` |
| Metadaten | `--grey` (`--fg-muted`) | `#67645d` (5.3:1, AA) |
| Haarlinie | `--line` / `--line-strong` | `#dcd5c6` / `#b8b0a0` |
| Hausfarbe | `--navy` / `--navy-deep` | `#152238` / `#0f1a2c` |
| Akzent | `--brass` (`--accent`) | `#7d5f33` auf Papier · `--brass-light` `#c2a36b` auf Marineblau |
| Text auf Marineblau | `--ivory` | `#f3efe5` |
| Ecken | `--radius` | `0` |

Primitive (`--c-*`) werden **nie** umdefiniert und nur in `tokens.css` und in Bühnen-Definitionen
verwendet. Komponenten nutzen ausschließlich die Rollen-Tokens.

Typo: `--t-xs … --t-xxl` (fluide), `--t-caps` für Garamond-Versalien, Lesespalte `--measure`
34em, Zeilenhöhe 1.6. Sperrungen: `--track-mark` (Wortmarke), `--track-head` (Sektionstitel),
`--track-caps` (Archivo-Etiketten).

## 5. Komponenten

| Komponente | Zweck |
|---|---|
| `BaseLayout` | Pflicht für jede Seite |
| `Header` | Wappen + Wortmarke links, Etiketten-Navigation rechts; aktive Seite mit Messing-Unterstrich |
| `PageHeader` | Titel (+ ein Satz) + Brotkrumen + Zierlinie |
| `Footer` | Marineblaue Bühne: Wappen in Messing, Wortmarke, Spalten mit Etiketten-Köpfen |
| `ExplorationList` | typografischer Index: Datum · Titel/Beschreibung · Art |
| `ProjectCard` | 4 Varianten nach `kind`; `uniform` = gemeinsames Hochformat 4:5 für Raster |
| `ProjectField` | strenges Katalograster (4/3/2 Spalten), gleiche Formate |
| `MediaBand` | randloses Bild-/Video-Band; Höhen full/band/short, `overlay` (= `--scrim`), label |
| `LogList`, `Breadcrumbs`, `Crest` | Logbuch, Navigation (Etiketten), Wappen (`currentColor`) |
| MDX: `Figure`, `Callout`, `Stats`, `Video` | ohne Import in MDX nutzbar |
| Utilities | `.wrap .space .sec .display .t-xxl…t-m .mark .khead .label .meta .lead .link .plain .muted .ledger .rule .rule--double .rule--brass` |

Neue Sektion = `<section class="wrap space"><div class="sec">` + `h2.khead` links + Inhalt rechts.
Faktentabellen = `<dl class="ledger">` (Etikett links, Wert rechts, wie ein Registerauszug).
Bilder, die gerahmt wirken sollen (Porträts), bekommen ein Passepartout: Innenabstand,
Haarlinie, `--paper-deep`.

## 6. Ton & Copy (verbindlich)

Die Seite ist **Visitenkarte und Register**: zuerst muss man vertrauen und sofort finden, was
Dennis tut. Sprache daher **nüchtern, faktisch, institutionell** – wie ein seriöses Haus über
sich schreibt.

- ✅ Faktische Aussagen: „Unternehmer und Produktentwickler aus Deutschland.“ Zähler statt
  Adjektive. Klare Bereichsnamen. **Sie-Form** in allen Interface-Texten; Ich-Form nur in
  Dennis' eigenen Texten (Explorationen, Über).
- ❌ Pathos, Metaphern, Leitsätze als Headline, Latein/Motto im UI, Superlative, Füllwörter,
  Selbstlob, Startup-Jargon („Lass uns …“, „Let's build“).
- Die Startseite führt mit **Wappen → Name → faktische Zeile → Zierlinie → Verzeichnis**.
  Das Verzeichnis (`index.astro`) ist das Herzstück: ein Bereich pro Zeile, mit echtem Zähler.

## 7. Mechanik

**Bühnen.** `.stage` + Variante (`.stage--paper`, `.stage--navy`). Eine Bühne setzt
`--stage-bg/fg/muted/line/accent` und definiert darüber die Rollen-Tokens (`--fg`, `--ink`,
`--grey`, `--line`, `--accent`, `--brass` …) neu – Links, Meta, Haarlinien und Messing passen
sich ohne Sonderregeln an. **Bühnen-Werte nur aus Primitiven (`--c-*`)**, sonst entsteht ein
Zyklus (`--grey` → `--stage-muted` → `--grey`) und die Werte werden ungültig.
Vollflächig: `<section class="stage stage--navy">` enthält innen `.wrap`. Endet `main` mit einer
marineblauen Bühne, schließt die Fußzeile nahtlos an (nur eine Haarlinie, `global.css`).
Reveal nie auf die Bühne selbst legen – nur auf deren Inhalt.

**Wortmarke.** `.mark` = Garamond 500, Versalien, `--track-mark`. Zentriert gesetzt (Startseite)
gleicht `padding-left: var(--track-mark)` die Sperrung des letzten Buchstabens aus.

**Bewegung.** `[data-reveal]` + globaler IntersectionObserver in `BaseLayout.astro`. Element
startet `.is-hidden` (leicht versetzt + transparent), wird beim Eintritt `.is-in`. Optionaler
Staffel-Delay: `data-reveal="80"` = 80 ms. Tokens: `--med`, `--ease-out`, `--reveal-y`.

**Rundungen & Schatten.** Reset setzt `border-radius: var(--radius)` (= 0) auf alle Elemente,
auch Formularelemente. `npm run check:seo` bricht ab, sobald gebautes CSS eine Rundung ≠ 0
oder einen Schatten enthält.

**OG/Social.** `src/lib/og.ts` spiegelt die Palette (`C`): OG-Bilder auf Marineblau mit Wappen
in Messing, Wortmarke, Zierlinie; Carousel-Folien auf Papier, letzte Folie auf Marineblau.

**Icons.** `public/favicon.svg` (Wappen in Marineblau, im Dark Mode Elfenbein);
`apple-touch-icon.png`, `icon-512.png`, `favicon-32.png` = Wappen in Elfenbein auf Marineblau.
