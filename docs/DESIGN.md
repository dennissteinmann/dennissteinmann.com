# Designsystem v3 – „Daylight Technocracy“

Strenger, institutioneller Minimalismus im Geist von Alexander Wang, gewärmt wie ein
Anthropic-Launch. **Warmes Bone-Grundgerüst, Grotesk als Maschine, EB Garamond als menschliche
Stimme, warme Bühnen (Bone/Kraft/Clay/Ink), und – zentral – Farbe aus Fotografie/Video statt
flacher UI-Fläche.** Akzent ist erdiges Clay/Terrakotta, sparsam. Das Ergebnis: vertrauenswürdig
wie eine seriöse Firma, lebendig wie eine Frontier-Werkstatt. Die Startseite ist Visitenkarte
und Register zugleich. Alle Werte: [`src/styles/tokens.css`](../src/styles/tokens.css).
**Medien-Leitfaden & KI-Prompt-Pack: [`docs/MEDIA.md`](MEDIA.md).** Begründung & Abgrenzung zu
v2 „Weißraum“: `docs/DECISIONS.md` (2026-10-05). Systemdetails siehe §7.

## 1. Moodboard

Referenzen in [`docs/moodboard/`](moodboard/) (v2 = aktuell, `v1/` = verworfen).

| Referenz | Was wir daraus nehmen |
|---|---|
| `v2-sebastian-wolf.jpg` – weiße Seite, winzige Navigation, horizontale Bildreihe | Weißraum als Hauptgestaltungsmittel, kleine Sans-Navigation, horizontale Projekt-Galerie auf der Startseite |
| `v2-state-of-sage.jpg` – Ölgemälde-Wolken, klassische Serif, Erdtöne | EB Garamond als Stimme, naturalistische Bildwelt, Kursiv als einziges Betonungsmittel |
| `v2-saint-laurent-interieur.jpg` – Nussbaum, Goldsamt, Marmor, Zurückhaltung | Naturtöne (`--walnut`, `--velvet`, `--marble`) nur als vollflächige Bühnen, z. B. letzte Carousel-Folie oder Cover-Fallback |
| `v1/wappen.jpg` | Wappen bleibt als leises Signet im Footer & Favicon |

## 2. Verbote (aus Feedback, verbindlich)

Diese Muster sind ausdrücklich unerwünscht, weil sie wie „typisches KI-Webdesign“ wirken:

- ❌ Orange/neonfarbene Akzente (der „KI-Look“). Farbe = Erde, Stein, Pflanze, Gold – nie Neon.
- ❌ Creme-/Papier-Töne als *Standard*-Seitenhintergrund (als Farbbühne `--velvet`/`--cream` ok)
- ❌ Eyebrow-/Kicker-Texte über Überschriften („KAPITEL 01“, „● LIVE“ …)
- ❌ Status-Punkte, pulsierende Dots, Marquees, Filmkorn, sichtbare Raster-Linien
- ❌ Nummerierte Section-Heads, Mono-Schrift-Deko, Buttons mit Rahmen
- ❌ Schatten, Verläufe, Glassmorphism, Emojis, Icon-Libraries

**Bewegung** ist ab v3 erlaubt, aber nur ruhig: Scroll-Einblendungen (`[data-reveal]`, steigt
auf + blendet ein) und dezente Hover-Verschiebungen. Niemals zappelig, nie Dauerschleife.
`prefers-reduced-motion` wird respektiert (alles bleibt sichtbar ohne JS/Animation).

## 3. Prinzipien

1. **Weißraum ist Inhalt.** Abstände `--s-7`/`--s-8` zwischen Sektionen. Lieber leer als voll.
2. **Bauhaus-Raster.** 12 Spalten, bewusst asymmetrisch: Abschnittstitel links (3/12),
   Inhalt rechts (9/12); Texte eingerückt auf Spalte 4; Projekte versetzt (`ProjectField`).
3. **Zwei Stimmen (v3).** **Grotesk (Archivo)** ist die Maschine – Wortmarke, Navigation,
   Sektionstitel, Register; Großbuchstaben, enge Laufweite (`.mark`, `.khead`). **Serif
   (EB Garamond)** ist der Mensch – Leads, Langform, Zitate. Mehr Schriften gibt es nicht.
4. **Schwarz/Weiß-UI auf Weiß, Farbe auf Bühnen.** Auf Weiß: Links schwarz, Hover Deckkraft 0.5,
   kein Akzent. Farbe kommt in vollflächigen **Bühnen** (`.stage--*`), die ihre Semantik-Tokens
   umdefinieren – Inhalte darauf (Links, Meta, Linien) passen sich automatisch an.
5. **Farbe ist Natur & Projekt.** Bühnen nur aus den Natur-Tokens (`--walnut --marble --velvet
   --cloud --earth`); `color` im Projekt-Frontmatter färbt dessen Karte. Nie frei erfundene
   oder Neon-Farben.

## 4. Tokens

| Rolle | Token | Wert |
|---|---|---|
| Hintergrund | `--bg` / `--bone` | `#f5f3ec` (warmes Bone, kein kaltes Weiß) |
| Text | `--ink` / `--coal` | `#1a1711` (warm) |
| Akzent | `--clay` / `--clay-soft` | `#be5b3e` / `#cc785c` (sparsam) |
| Warme Bühnen | `--bone-deep --kraft` | `#ece7da` / `#d9c6a9` |
| Sekundär | `--grey` | `#8c8578` (warmes Taupe) |
| Haarlinie | `--line` | `#e4ddce` (warm) |
| Bild-Platzhalter | `--placeholder` | `#efe9dc` |
| Tiefe Naturtöne | `--walnut --velvet --marble --cloud --earth --cream` | nur hinter Bild/Video |

Typo: `--t-xs … --t-xxl` (fluide), Lesespalte `--measure` 34em, Zeilenhöhe 1.55.

## 5. Komponenten

| Komponente | Zweck |
|---|---|
| `BaseLayout` | Pflicht für jede Seite |
| `PageHeader` | Titel (+ ein Satz) + Brotkrumen, viel Luft oben |
| `ExplorationList` | typografischer Index: Datum · Titel/Beschreibung · Art |
| `ProjectCard` | 4 Varianten nach `kind`: **Objekt** (App-Icon auf Farbfläche), **Screen** (Cover/Domain), **Wortmarke** (Unternehmen), **Cover** (Medien/Forschung, Hochformat) |
| `ProjectField` | asymmetrisches Raster mit Rhythmus (Spaltenstart, Breite, Versatz) |
| `MediaBand` | randloses Bild-/Video-Band (Atmosphäre); Höhen full/band/short, overlay, label |
| `LogList`, `Breadcrumbs`, `Crest` | Logbuch, Navigation, Signet (nur Footer) |
| MDX: `Figure`, `Callout`, `Stats`, `Video` | ohne Import in MDX nutzbar |
| Utilities | `.wrap .space .display .t-xxl…t-m .sans .meta .lead .link .plain .muted` |

Neue Sektion = `<section class="wrap space">` + Titel `h2.display.t-m` links + Inhalt rechts.

## 6. Ton & Copy (verbindlich)

Die Seite ist **Visitenkarte und Register**: zuerst muss man vertrauen und sofort finden, was
Dennis tut. Sprache daher **nüchtern, faktisch, institutionell** – wie eine seriöse Firma über
sich schreibt, nicht wie ein Manifest.

- ✅ Faktische Aussagen: „Unternehmer und Produktentwickler aus Deutschland.“ Zähler statt
  Adjektive. Klare Bereichsnamen. Erste-Person nur, wo es natürlich ist.
- ❌ Pathos, Metaphern, Leitsätze als Headline („Ich denke öffentlich nach …“), Latein/Motto
  im UI, Superlative, Füllwörter, Selbstlob.
- Die Startseite führt mit **Name → eine faktische Zeile → Verzeichnis**. Das Verzeichnis
  (`index.astro`) ist das Herzstück: ein Bereich pro Zeile, mit echtem Zähler.

## 7. „Daylight Technocracy“ (v3) – Mechanik

**Palette (Anthropic-warm).** Grund `--bone` (#f5f3ec, kein kaltes Weiß), Text warmes `--ink`
(#1a1711). Akzent `--clay` (#be5b3e, Terrakotta) – sparsam: Zähler, ein Kontaktband, Hover.
Warme Bühnen: `.stage--bone` (ruhig), `.stage--kraft` (Tan), `.stage--clay` (lauter Moment),
`.stage--ink` (dunkle Fläche – nutzt `--coal`, da `.stage` `--ink` umdefiniert). Tiefe Naturtöne
(`walnut`/`marble`) nur noch hinter Bild/Video. **Farbe kommt primär aus Medien, nicht aus UI.**

**Medien.** Große Bilder/Videos über **`MediaBand`** (`src/components/MediaBand.astro`):
Höhen `full`/`band`/`short`, optionaler warmer `overlay` für hellen Text, `label`/`caption`,
Video stumm/loop/autoplay/inline. Alle Asset-Specs, Slots und das **KI-Prompt-Pack**: `docs/MEDIA.md`.

**Typografie.** `--grotesk`/`--sans` = **Archivo** (variabel, selbst gehostet). `--serif` =
EB Garamond bleibt für Langform/Leads. Utilities: `.mark` (Wortmarke, Caps, eng, fett),
`.khead` (Grotesk-Sektionstitel in Caps). Navigation & Footer sind Grotesk-Caps.
Die große Wortmarke skaliert fluide (`clamp(2.1rem, 12.5vw, 8.5rem)`) und läuft nie über
(längste Zeile „STEINMANN“).

**Farbbühnen.** `.stage` + Variante (`.stage--walnut`, `--marble`, `--velvet`, `--cloud`).
Eine Bühne setzt `--stage-bg/fg/muted/line` und definiert darüber die Semantik-Variablen
(`--fg`, `--ink`, `--link`, `--line` …) neu – deshalb funktionieren bestehende Utilities und
Komponenten (Links, `.muted`, Haarlinien, Projektkarten) ohne Sonderregeln auf jeder Bühne.
Vollflächig: `<section class="stage stage--walnut">` enthält innen `.wrap`. Reveal nie auf die
Bühne selbst legen (sonst blendet die Farbfläche mit aus) – nur auf deren Inhalt.

**Bewegung.** `[data-reveal]` + globaler IntersectionObserver in `BaseLayout.astro`. Element
startet `.is-hidden` (versetzt + transparent), wird beim Eintritt `.is-in`. Optionaler
Staffel-Delay als Wert: `data-reveal="80"` = 80 ms. Tokens: `--med`, `--ease-out`, `--reveal-y`.
Ohne JS oder bei `prefers-reduced-motion` ist alles sofort sichtbar.

**OG/Social.** `src/lib/og.ts`: `Sans` = Archivo (woff), `Serif` = EB Garamond. Titelzeilen
noch Serif – ein Grotesk-Caps-Redesign der OG-Vorlagen ist offener Folgeschritt.
