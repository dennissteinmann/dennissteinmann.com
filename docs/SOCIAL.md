# Vom Artikel zum Social-Media-Content

Prinzip: **Website first.** Der Artikel ist das Original, Social Media verteilt ihn.
Jeder Post verweist zurück auf die kanonische URL.

## Was automatisch entsteht (bei jedem Build)

| Asset | URL | Format |
|---|---|---|
| Link-Vorschau (OG) | `/og/artikel/<slug>.png` | 1200×630 |
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
      text: Ein Artikel liefert Stoff für zehn Posts.
  cta: Warum ich zuerst hier schreibe                         # letzte Folie
  caption: |                                                  # fertiger Post-Text (optional)
    …
```

## Workflow

1. Artikel schreiben → `draft: false` → pushen (live).
2. `/social/<slug>/` öffnen → Folien herunterladen, Post-Text kopieren.
3. Posten (LinkedIn-Dokument/Carousel, Instagram-Carousel); Link in Kommentar/Bio.
4. Optional: Logbuch-Eintrag mit `article: <slug>`.

## Design

Folien nutzen dieselbe Palette & Typografie wie die Website (`src/lib/og.ts`):
Cover dunkel mit Gold-Glow · Inhalt auf Papier-Creme mit orangefarbener Nummer ·
Abschluss in Signal-Orange. Wappen + Wortmarke auf jeder Folie.
