# Von der Exploration zum Social-Media-Content

**Zentrale: `/studio/`** (noindex) – alle Kanäle, alle Explorationen, Verbreitungsstatus je Kanal.

Prinzip: **Website first.** Die Exploration ist das Original, Social Media verteilt sie.
Jeder Post verweist zurück auf die kanonische URL.

## Was automatisch entsteht (bei jedem Build)

| Asset | URL | Format |
|---|---|---|
| Link-Vorschau (OG) | `/og/explorationen/<slug>.png` | 1200×630 |
| Carousel-Folien | `/social/<slug>/1.png … n.png` | 1080×1350 (LinkedIn/Instagram) |
| Social-Kit | `/social/<slug>/` | Übersicht, Downloads, Post-Text zum Kopieren |

Das Social-Kit ist `noindex` und per robots.txt gesperrt – ein internes Werkzeug.
Lokal: `http://localhost:4321/social/<slug>/`.

## Folien steuern

Ohne Angaben: Cover = Titel, Folien = `keyTakeaways`, Abschluss = CTA mit Link.
Mit Frontmatter volle Kontrolle:

```yaml
social:
  hook: Social Media ist Miete. Deine Website ist Eigentum.   # Cover-Folie
  slides:                                                     # max. 8
    - title: Geliehene Reichweite
      text: Der Algorithmus entscheidet, wer deine Arbeit sieht.
    - title: Langform zuerst
      text: Eine Exploration liefert Stoff für zehn Posts.
  cta: Warum ich zuerst hier schreibe                         # letzte Folie
  caption: |                                                  # fertiger Post-Text (optional)
    …
```

## Workflow

1. Exploration schreiben → `draft: false` → pushen (live).
2. `/social/<slug>/` öffnen → Folien herunterladen, Post-Text kopieren.
3. Posten (LinkedIn-Dokument/Carousel, Instagram-Carousel); Link in Kommentar/Bio.
4. In der Exploration eintragen: `distribution: [{ channel: linkedin, url: …, date: … }]` → Studio zeigt es, das Schema verknüpft Post und Original.
5. Kanäle (Profile-URLs) pflegen: `CHANNELS` in `src/site.config.ts`.

## Design

Folien folgen dem Weißraum-Design (`src/lib/og.ts`): weiße Flächen, EB Garamond, Jost für
Name/Zähler. Nur die letzte Folie steht auf Nussbaum (`--walnut`) mit cremefarbener Schrift.
