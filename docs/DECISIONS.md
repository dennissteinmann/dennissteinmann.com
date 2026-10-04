# Architekturentscheidungen (ADR-Log)

Neue Einträge oben anfügen. Format: Datum · Entscheidung · Begründung · Konsequenz.

---

### 2026-10-04 · Redesign „Weißraum“ (Designsystem v2)
**Begründung:** Feedback: v1 wirkte wie typisches KI-Webdesign (Orange-Akzent, Papier-Hintergrund,
Eyebrows, Status-Dots). Neues Moodboard (Sebastian Wolf, State of Sage, Saint Laurent):
künstlerischer Minimalismus, Bauhaus, naturalistisch. **Konsequenz:** Nur Hell (echtes Weiß),
kein Dark Mode, EB Garamond + Jost, keine UI-Akzentfarbe. Verbote in docs/DESIGN.md §2.

### 2026-10-04 · „Explorationen“ statt „Artikel“, neue Collections
**Begründung:** Die Seite ist Zentrale des Denkens; Texte wachsen weiter (Digital Garden).
Vor dem Livegang umbenannt, daher kein Redirect nötig. Neu: `topics` (Experten-Hubs),
`media`, `press`, Projekt-`documents`, `distribution`. **Konsequenz:** URLs `/explorationen/…`
sind ab Livegang permanent.

### 2026-10-04 · Projekte aus lokalen Ordnern importiert
**Begründung:** Alle realen Projekte sollen sichtbar sein. 59 Einträge automatisch aus
`SmartOps/Projekte`, `Unternehmen` und dem App-Store-Cache erzeugt; unvollständige als
`draft: true`. **Konsequenz:** Texte vor dem Livegang prüfen (Kommentar im MDX zeigt Quelle).

### 2026-09-30 · Astro als statischer Site-Generator
**Begründung:** Reines HTML ohne Runtime = maximal schnell, sicher, crawlbar (auch für
KI-Crawler ohne JS), billig zu hosten und in Jahrzehnten noch deploybar. Content
Collections mit Schemas erzwingen Qualität. **Konsequenz:** Kein serverseitiger Code;
dynamische Features (Kommentare, Newsletter) später nur als externe, datensparsame Dienste.

### 2026-09-30 · Inhalte als MDX-Dateien im Repo statt CMS
**Begründung:** Versioniert, portabel, kein Vendor-Lock-in, KI-Agenten können direkt
mitschreiben. Bilder liegen neben dem Text. **Konsequenz:** Veröffentlichen = Commit + Push.
Ein Git-basiertes CMS (z. B. Decap/Tina) kann später ohne Umbau ergänzt werden.

### 2026-09-30 · Deutsche URLs ohne Datum, Slash am Ende
**Begründung:** Zielgruppe deutschsprachig; Evergreen-URLs erlauben Updates ohne
URL-Wechsel; Slash-Konvention verhindert Duplikate. **Konsequenz:** Slugs sind permanent.

### 2026-09-30 · Logbuch ohne Einzel-URLs (gilt weiter)
**Begründung:** Kurze Notizen wären Thin Content und würden die Domain-Qualität senken.
**Konsequenz:** Anker-Links `/logbuch/#log-…`; Ausführliches wird eine Exploration.

### 2026-09-30 · Eigener Sitemap-/robots-/llms.txt-Endpunkt statt Plugins
**Begründung:** Eine Quelle (`src/lib/urls.ts`) für Sitemap und llms.txt, `lastmod` aus
echten Daten, noindex-Konsistenz prüfbar. **Konsequenz:** Neue Routen dort eintragen.

### 2026-09-30 · KI-Crawler ausdrücklich erlauben
**Begründung:** Sichtbarkeit in KI-Antworten ist Ziel der Personal Brand.
**Konsequenz:** Inhalte können in Trainingsdaten landen – bewusst akzeptiert.

### 2026-09-30 · ~~Dunkles Standard-Theme + helles „Papier“-Theme~~ (ersetzt 2026-10-04)
**Begründung:** Moodboard ist überwiegend dunkel/kinematografisch; LinkedIn-Carousels
sind hell/creme. Beide Welten gehören zur Marke. **Konsequenz:** Jede Komponente wird
in beiden Themes geprüft; System-Präferenz wird respektiert, Toggle speichert lokal.

### 2026-09-30 · Selbst gehostete Schriften, kein Tracking
**Begründung:** DSGVO ohne Cookie-Banner, Performance, Unabhängigkeit.
**Konsequenz:** Reichweitenmessung höchstens über Server-Logs oder ein cookieloses,
selbst gehostetes Tool (erst nach Eintrag hier).

### 2026-09-30 · Social-Grafiken zur Build-Zeit (satori)
**Begründung:** Jede Exploration bekommt ohne Handarbeit OG-Bild und Carousel im
Markendesign. **Konsequenz:** Palette in `src/lib/og.ts` muss mit `tokens.css` synchron
bleiben.
