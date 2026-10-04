# Designsystem v2 – „Weißraum“

Künstlerischer Minimalismus mit Bauhaus-Raster. **Echtes Weiß, echtes Schwarz, viel Raum.**
Farbe kommt ausschließlich aus Bildern, Natur und den Projekten selbst – nie aus der UI.
Alle Werte: [`src/styles/tokens.css`](../src/styles/tokens.css).

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

- ❌ Orange/neonfarbene Akzente, Creme-/Papier-Hintergründe
- ❌ Eyebrow-/Kicker-Texte über Überschriften („KAPITEL 01“, „● LIVE“ …)
- ❌ Status-Punkte, pulsierende Dots, Marquees, Filmkorn, sichtbare Raster-Linien
- ❌ Nummerierte Section-Heads, Mono-Schrift-Deko, Buttons mit Rahmen
- ❌ Schatten, Verläufe, Glassmorphism, Emojis, Icon-Libraries

## 3. Prinzipien

1. **Weißraum ist Inhalt.** Abstände `--s-7`/`--s-8` zwischen Sektionen. Lieber leer als voll.
2. **Bauhaus-Raster.** 12 Spalten, bewusst asymmetrisch: Abschnittstitel links (3/12),
   Inhalt rechts (9/12); Texte eingerückt auf Spalte 4; Projekte versetzt (`ProjectField`).
3. **Zwei Stimmen.** Serif (EB Garamond) spricht – Titel, Text, Zitate. Sans (Jost, Futura-Linie)
   ordnet – Navigation, Metadaten, Links. Mehr Schriften gibt es nicht.
4. **Schwarz/Weiß-UI.** Links sind schwarz mit grauer Unterstreichung. Hover = Unterstreichung
   schwarz oder Deckkraft 0.5. Kein Akzent.
5. **Farbe gehört den Projekten.** `color` im Projekt-Frontmatter färbt nur dessen Karte
   (App-Farbflächen werden aus dem Icon abgeleitet, Richtung Weiß abgemildert).

## 4. Tokens

| Rolle | Token | Wert |
|---|---|---|
| Hintergrund | `--bg` / `--white` | `#ffffff` |
| Text | `--ink` | `#121212` |
| Sekundär | `--grey` | `#8c8c8c` |
| Haarlinie | `--line` | `#e9e9e9` |
| Bild-Platzhalter | `--placeholder` | `#f4f4f3` (nie als Seitenfläche) |
| Naturtöne | `--walnut --velvet --marble --cloud --earth --cream` | nur Bühnen/Projekte |

Typo: `--t-xs … --t-xxl` (fluide), Lesespalte `--measure` 34em, Zeilenhöhe 1.55.

## 5. Komponenten

| Komponente | Zweck |
|---|---|
| `BaseLayout` | Pflicht für jede Seite |
| `PageHeader` | Titel (+ ein Satz) + Brotkrumen, viel Luft oben |
| `ExplorationList` | typografischer Index: Datum · Titel/Beschreibung · Art |
| `ProjectCard` | 4 Varianten nach `kind`: **Objekt** (App-Icon auf Farbfläche), **Screen** (Cover/Domain), **Wortmarke** (Unternehmen), **Cover** (Medien/Forschung, Hochformat) |
| `ProjectField` | asymmetrisches Raster mit Rhythmus (Spaltenstart, Breite, Versatz) |
| `LogList`, `Breadcrumbs`, `Crest` | Logbuch, Navigation, Signet (nur Footer) |
| MDX: `Figure`, `Callout`, `Stats`, `Video` | ohne Import in MDX nutzbar |
| Utilities | `.wrap .space .display .t-xxl…t-m .sans .meta .lead .link .plain .muted` |

Neue Sektion = `<section class="wrap space">` + Titel `h2.display.t-m` links + Inhalt rechts.
