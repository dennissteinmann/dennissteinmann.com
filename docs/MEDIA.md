# Medien – Art Direction & KI-Asset-Pipeline

Im Designsystem v4 „Kontor“ (`docs/DESIGN.md`) trägt die UI nur Papier, Tinte, Marineblau und
Messing – **Fotografie und Video** liefern Atmosphäre. Diese Datei ist der verbindliche
Leitfaden, damit alle Assets wie **eine einzige Serie** wirken: hanseatisch, ruhig, gediegen –
wie die Bildwelt eines Privatclubs oder Handelshauses, nie wie eine Werbekampagne. Quelle laut `docs/DECISIONS.md` (2026-10-05): **KI-generiert**
(Midjourney/Flux für Stills, Runway/Veo für Bewegung), von Dennis erzeugt, hier eingepflegt.

## 1. Die Haltung (der „Look“)

**Ja:** warmes, weiches Licht (golden hour, Nordlicht, Studio-Bounce); industrielle & architek-
tonische Oberflächen (Backstein, dunkles Holz, Messing, Stein, Glas, Leinen, Papier, Wasser); abstrakte Makro-
Texturen; weite, ruhige Kompositionen mit viel Luft; naturalistische Farbe, die zur Palette passt;
35mm-/Mittelformat-Filmlook, feines, organisches Korn, flacher Kontrast.

**Nein:** Neon, grelles Orange als „KI-Look“, HDR-Überschärfe, Linsen-Flares, Stockfoto-Lächeln,
Business-Klischees, sichtbare (erfundene) Logos/Marken/Text im Bild, Gesichter realer Personen,
Collage/3D-Render-Kitsch, Emojis, Meme-Ästhetik. Nichts, was reale Ereignisse vortäuscht.

**Grundregel:** Bilder sind *Atmosphäre*, nicht Illustration des Inhalts. Die Projekte sind Apps –
die Medien liefern Stimmung und Vertrauen, nie eine wörtliche Abbildung.

## 2. Palette-Lock (zum Steuern der Generierung)

Die Assets sollen in dieser Welt liegen (= `tokens.css`):

| Rolle | Hex | In Prompts als |
|---|---|---|
| Papier (Grund) | `#f6f3eb` | „ivory paper“ |
| Tinte (Tiefe) | `#14181f` | „blue-black ink“ |
| Marineblau (Hausfarbe) | `#152238` | „deep navy, hanseatic blue“ |
| Messing (Akzent) | `#7d5f33` / `#c2a36b` | „aged brass“ |
| Elfenbein (Text auf Marineblau) | `#f3efe5` | — |

Immer anhängen: *„restrained hanseatic palette, deep navy, ivory, aged brass, dark wood, warm
stone, no neon, no saturated primaries“*.

## 3. Slots, Formate, Ablage

| Slot | Seitenverhältnis | Export | Ablage | Verdrahtung |
|---|---|---|---|---|
| **Hero-Atmosphäre** (Startseite, dunkles Band) | 16:9, ≥ 2400px breit | `.webp` (Bild) / `.mp4`+`.webm` (Video) | `src/assets/media/hero/` | ersetzt das `.film`-Band durch `<MediaBand src=… height="full" overlay label=…>` (Import oben in `index.astro`); Video via `video="/media/hero/x.mp4"` + `poster` |
| **Projekt-Cover** | 4:5 (Hochformat) | `.webp`, ≥ 1200px breit | neben `index.mdx` im Projektordner | Frontmatter `cover: ./cover.webp` + `coverAlt:` (ProjectCard „Screen/Cover“) |
| **Exploration-Cover** | 1.91:1 | `.webp` | neben `index.mdx` | Frontmatter `cover:` + `coverAlt:` |
| **Medien-Galerie** (`/medien/`) | frei, konsistent | `.webp`/`.mp4` | `src/content/media/<jahr>/` | Media-Collection-Eintrag |
| **OG/Share** | wird gebaut (satori) | automatisch | — | Palette lebt in `src/lib/og.ts` (`C`) |

Große Full-Bleed-Bilder immer über **`MediaBand`** (`src/components/MediaBand.astro`): liefert
Seitenverhältnis-Varianten (`full`/`band`/`short`), optionalen warmen Verlauf (`overlay`) für
hellen Text, `label` und `caption`. Videos laufen stumm/loop/autoplay/inline.

## 4. KI-Prompt-Pack

**Basis-Template (Midjourney v7 / Flux):**
```
<motiv>, <licht>, <oberfläche/textur>, wide calm composition, generous negative space,
shot on medium format film, soft low contrast, restrained hanseatic palette —
ivory #f6f3eb, deep navy #152238, aged brass #7d5f33, blue-black #14181f —
no neon, no text, no logos, no people's faces, editorial, cinematic, architectural
--ar 16:9 --style raw --v 7
```
(Projekt-Cover: `--ar 4:5`. Flux: Params weglassen, Stil im Satz ausformulieren.)

**Fertige Prompts (konsistente Serie):**
1. *Hero:* „vast concrete interior, shaft of warm golden light across a bare wall, dust in air …“ `--ar 16:9`
2. *Hero alt:* „harbour at dusk, cranes and warehouse brick in navy haze, calm water, long exposure …“ `--ar 16:9`
3. *Kontor:* „quiet merchant's office, dark wood panelling, brass lamp, ivory paper on a desk, north light …“ `--ar 16:9`
4. *Natur/Frontier:* „fog over dark pine ridge at dawn, muted, filmic, vast sky, negative space …“ `--ar 16:9`
5. *Cover-Textur:* „macro of laid ivory paper with deckled edge and a brass detail, soft studio light …“ `--ar 4:5`
6. *Material:* „navy wool, brushed brass and dark walnut, close still life, calm, no logos …“ `--ar 4:5`
7. *Video (Runway/Veo):* „slow 8s dolly across a sunlit concrete hall, dust motes, warm, filmic,
   locked-off calm, restrained hanseatic palette, no text“ — Export stumm, 1080p+, als Loop schneiden.

Für Wiedererkennung: **eine** dieser Prompt-Familien je Durchgang wählen, Seed/Stil konstant
halten. Lieber 6 Bilder aus einer Welt als 20 aus sechs.

## 5. Pipeline & Qualität

1. Generieren → bei Bedarf leicht entsättigen/wärmen (Richtung Palette), **kein** schwerer Filter.
2. Als `.webp` exportieren (Bild) bzw. `.mp4` **und** `.webm` (Video, ≤ ~6 MB, 1080p, stumm).
3. In den Slot-Ordner legen (§3), sprechender Dateiname (`hero-concrete-light.webp`).
4. Verdrahten (Frontmatter-`cover` oder `MediaBand`), **immer** `alt`/`coverAlt` setzen (SEO + A11y);
   rein dekorative Atmosphäre: `alt=""`.
5. `npm run verify` – Astro optimiert Größen/Formate automatisch (`astro:assets`).

**Rechtlich/ehrlich:** KI-Bilder nur abstrakt/atmosphärisch. Keine realen Personen, keine
erfundenen Logos, nichts, was ein echtes Ereignis, Produkt oder eine Auszeichnung vortäuscht –
die Seite lebt von Vertrauen. Im Zweifel: Textband (`.film`) statt zweifelhaftem Bild.
