# SEO & AI Search Optimization (AISO)

Ziel: **Jahrzehntelange Auffindbarkeit** – in Google/Bing, in KI-Suche (ChatGPT Search,
Perplexity, Google AI Overviews, Claude) und offline (stabile, druckbare URLs).
Leitsatz: *Eine Person, eine Domain, stabile URLs, eindeutige Aussagen, maschinenlesbar.*

## 1. URL-Vertrag (nie brechen)

| Inhalt | Muster | Beispiel |
|---|---|---|
| Startseite | `/` | |
| Artikel | `/artikel/<slug>/` | `/artikel/warum-diese-website/` |
| Artikel (Markdown) | `/artikel/<slug>.md` | für KI-Agenten |
| Projekt | `/projekte/<slug>/` | `/projekte/dennissteinmann-com/` |
| Thema | `/themen/<tag>/` | `/themen/seo/` |
| Logbuch | `/logbuch/#log-<datei>` | Anker, keine Einzelseiten |
| Unterseite | `/<slug>/` | `/ueber/`, `/kontakt/` |

Regeln:
- Deutsch, Kleinbuchstaben, Bindestriche, Umlaute transkribiert (ä→ae), max. ~6 Wörter.
- **Kein Datum** im Pfad (Evergreen, Artikel dürfen aktualisiert werden).
- **Slash am Ende** (`trailingSlash: 'always'`), Canonical immer absolut mit `https://`.
- Slug = Ordnername. **Nach Veröffentlichung nie ändern.** Wenn doch: 301 im nginx.
- Kategorien heißen „Themen“ und sind flach (keine verschachtelten Pfade).
- Späteres Englisch: unter `/en/…` mit `hreflang` – deutsche URLs bleiben unverändert.

## 2. Informationsarchitektur (Hub & Spoke)

```
Startseite ─┬─ Artikel (Archiv nach Jahr) ── Artikel ──┬── Projekt (Hub)
            ├─ Projekte ── Projekt-Hub ────────────────┤── Themen
            ├─ Logbuch (Anker) ── verweist auf Artikel ─┘
            ├─ Themen ── Thema
            └─ Über (Entitäts-Hub der Person)
```
- **Projekte sind Hubs**: sammeln automatisch alle Artikel + Logbuch-Einträge mit `project:`.
- Jeder Artikel verlinkt: Projekt, Themen, Autor (/ueber/), 3 verwandte Artikel.
- Breadcrumbs sichtbar + als `BreadcrumbList`.
- Themen-Seiten mit < 2 Einträgen sind `noindex, follow` (Thin Content vermeiden).
- Logbuch-Einträge bekommen bewusst **keine** eigene URL (zu kurz = Thin Content).

## 3. Pflicht-Metadaten je Seite (automatisch via `SEO.astro`)

`<title>` („Titel · Dennis Steinmann“), Meta-Description (70–165 Zeichen, vom Schema
erzwungen), Canonical, robots, Open Graph inkl. 1200×630-Bild (automatisch generiert),
Twitter Card, `article:*`-Zeiten, RSS-/llms.txt-/Markdown-Alternates, JSON-LD.

## 4. Strukturierte Daten (`src/lib/seo.ts`)

| Seite | Typen |
|---|---|
| Alle | `WebSite` (`/#website`), `BreadcrumbList` |
| Start, Über, Artikel | `Person` (`/#person`) mit `sameAs`, `knowsAbout`, `image` |
| Artikel | `BlogPosting` (author → `/#person`, `abstract` = summary, `dateModified`), optional `FAQPage` |
| Übersichten | `CollectionPage` + `ItemList` |
| Über | `ProfilePage` |
| Projekt | `CreativeWork` |

Die `@id`s sind permanent. `PERSON.sameAs` in `site.config.ts` ist das wichtigste
Entitätssignal – alle eigenen Profile dort pflegen und von dort auf die Website verlinken.

## 5. AI Search Optimization

1. **Answer-first:** Jeder Artikel beginnt mit einer sichtbaren *Kurzfassung*
   (`summary`, Pflichtfeld, 120–600 Zeichen), die die Kernfrage direkt beantwortet.
2. **Extrahierbare Fakten:** `keyTakeaways` als nummerierte Liste, `faq` für echte
   Fragen, Zahlen konkret nennen, Quellen verlinken, klare `h2`-Struktur.
3. **Autorschaft & Aktualität:** Autorbox, `rel="author"`, sichtbares Veröffentlichungs-
   und Aktualisierungsdatum (`updated` setzen, wenn Inhalt substanziell geändert wurde).
4. **Maschinen-Zugänge:** `/llms.txt` (kuratierte Übersicht), `/llms-full.txt`
   (Volltexte), `/artikel/<slug>.md` (Markdown je Artikel), `/rss.xml`, `/sitemap.xml`.
5. **Crawler willkommen:** `robots.txt` erlaubt explizit GPTBot, OAI-SearchBot,
   ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended u. a.
6. **Statisches HTML:** Alle Inhalte sind ohne JavaScript im HTML – KI-Crawler rendern
   oft kein JS.

## 6. Performance = Ranking

Statisches HTML, keine Client-Frameworks, Bilder als AVIF/WebP mit `srcset`
(`astro:assets`), selbst gehostete Fonts, LCP-Bild mit `fetchpriority="high"`,
Zielwerte: LCP < 1,5 s, CLS < 0,05, INP < 100 ms.

## 7. Checkliste für neue Artikel

- [ ] Titel ≤ 80 Zeichen, enthält das Hauptthema; Slug kurz & sprechend
- [ ] `description` 70–165 Zeichen: Nutzen + Neugier
- [ ] `summary` beantwortet die Kernfrage in 2–4 Sätzen
- [ ] 1–6 `tags` (vorhandene wiederverwenden, siehe `/themen/`), `project` gesetzt
- [ ] `keyTakeaways` (3–7), bei Bedarf `faq`
- [ ] Zwischenüberschriften als echte Fragen/Aussagen; interne Links auf ältere Artikel
- [ ] Bilder mit `alt`, Titelbild ≥ 1600 px breit
- [ ] `draft: false` erst, wenn fertig · `npm run verify` grün

## 8. Automatische Prüfung

`scripts/check-dist.mjs` prüft nach jedem Build jede Seite (Title, Description,
Canonical, genau eine h1, og:image, alt-Texte, JSON-LD, tote Links, Slash-Konvention)
und die Konsistenz von Sitemap ↔ noindex. Läuft in CI vor dem Deploy.
