# Architekturentscheidungen (ADR-Log)

Neue Einträge oben anfügen. Format: Datum · Entscheidung · Begründung · Konsequenz.

---

### 2026-10-05 · Git-basiertes CMS (Sveltia) + kuratierte Startseite
**Begründung:** Dennis will Inhalte (v. a. Projekte & Unternehmen) einfach und „diskret"
pflegen, ohne die MDX-Struktur von Hand zu kennen. Außerdem: weniger erklärende „Warum"-Copy,
einfachere Landing, die zu den wichtigen Stücken führt (Referenzen: tiffanydevos.be,
askmidnight.com). **Konsequenz:**
- **Sveltia CMS** unter `public/admin/` (noindex, in `robots.txt` gesperrt). Git-basiert, kein
  Server/DB, kein Vendor-Lock-in – passt zum Astro-/Repo-Prinzip. Speichern = Commit = Deploy.
  Lokaler Modus funktioniert ohne jede Einrichtung; „von überall" via GitHub-OAuth optional.
  Mapping aller Collections in `public/admin/config.yml`. Doku: `docs/CMS.md`.
- **Projekte & Unternehmen = eine Collection**, `kind` unterscheidet (kein zweites Verzeichnis).
- Neues Feld `featured` (Projekt) → Startseite zeigt hervorgehobene Projekte zuerst.
- Startseiten-Copy entschlackt: Missions-/„Warum"-Band entfernt, Lead auf faktische Rolle
  gekürzt, Themen-Beschreibung neutralisiert. Volle Landing-Vereinfachung + Innenseiten-
  Redesign (askmidnight-Geist in warmer Palette) = nächster Schritt.

### 2026-10-05 · v3-Feinschliff: „Anthropic-warm“ + Medien tragen die Farbe
**Begründung:** Dennis hat „Serif und Braun“ hinterfragt und auf Anthropics Launch-Sprache
verwiesen (warm, filmisch, naturalistisch). Entscheidungen: **Serif bleibt** (Anthropic paart
selbst Serif + Grotesk). **Braun raus** als dominante Fläche. Grund wird **warmes Bone** statt
Weiß, Akzent ist **Clay/Terrakotta** (ein lauter Moment, kein Dauerton). **Farbe kommt aus
Medien** (Fotografie/Video), nicht aus flachen UI-Blöcken. Medienquelle: **KI-generiert**
(Midjourney/Flux + Runway/Veo), von Dennis erzeugt. **Konsequenz:**
- `tokens.css`: neue warme Grundpalette (`--bone`, `--kraft`, `--clay`, warmes `--ink`/`--coal`,
  warme Greys/Lines). `--bg` = Bone. Das v3-Verbot „kein Cremegrund / kein Orange“ ist damit
  **bewusst aufgehoben** (warmes Bone-Grund + erdiges Clay sind jetzt Kern, Neon-Orange bleibt tabu).
- Neue warme Bühnen `.stage--bone/kraft/clay/ink` (Startseite: Projekte=kraft, Themen=ink,
  Kontakt=clay). Tiefe Naturtöne (walnut/marble) bleiben nur für bild-/videohinterlegte Bühnen.
  Bug behoben: `.stage--ink` nutzt `--coal` (nicht `--ink`, das auf Bühnen umdefiniert wird).
- Neue Komponente **`MediaBand`** (`src/components/MediaBand.astro`) für randlose Bild-/Video-Bänder.
- **`docs/MEDIA.md`** neu: Art-Direction, Palette-Lock, Slot-Specs und ein **KI-Prompt-Pack**,
  damit generierte Assets konsistent sind und als Drop-in einrasten.
- OG-Palette (`src/lib/og.ts`) auf Bone/Clay umgestellt.
- Startseiten-Hero ist vorerst ein dunkles Text-Band (`.film`); wird zu `MediaBand`, sobald die
  KI-Atmosphäre existiert. Projekt-Cover/Medien-Galerie: Assets stehen noch aus.

### 2026-10-05 · Designsystem v3 „Daylight Technocracy“ (ersetzt v2 „Weißraum“)
**Begründung:** Vorgabe von Dennis: „100 % Wang“ (strenges, institutionelles Modehaus-Gefühl)
**plus** mehr Farbe, mehr Bewegung, mehr zu sehen, „AI-Frontier“ und „naturalistische
Technokratie“. Gewählte Synthese (von drei vorgelegten Richtungen): **„Daylight Technocracy“** –
weißes Grundgerüst bleibt (hell, lesbar, vertrauenswürdig), aber mit voller Wucht an Farbe/Leben.
**Konsequenz:**
- **Schrift:** Jost → **Archivo** (Grotesk) als `--sans`/`--grotesk`. EB Garamond bleibt als
  Serif-Stimme für Langform/Leads. Wortmarke & Struktur sind jetzt Grotesk-Caps.
- **Farbe:** Die Naturtöken werden von reinen Bild-Bühnen zu **aktiven, vollflächigen
  Farbbühnen** (`.stage--walnut/marble/velvet/cloud`). Das lockert das alte v2-Verbot
  „keine Farbe in der UI“. Neon/Orange (der „KI-Look“) bleibt verboten.
- **Bewegung:** Scroll-Einblendungen (`[data-reveal]`) + Hover-Verschiebungen neu erlaubt;
  `prefers-reduced-motion` respektiert. Lockert v2 „Bewegung: ruhig“ (bleibt ruhig, aber vorhanden).
- **Startseite:** riesige Wortmarke → Register → Farbbühnen (Projekte walnut, Themen marble) →
  Porträt. Doku: `docs/DESIGN.md` §7 + aktualisierte §2/§3; `CLAUDE.md` §2 angepasst.
- **Offen:** OG-/Social-Vorlagen (`src/lib/og.ts`) nutzen Archivo für „Sans“, Titel noch Serif –
  ein Grotesk-Caps-Redesign der Bildvorlagen steht aus. v2-Moodboard-Tabelle bleibt gültig
  (gleiche Referenzen, schärfer interpretiert).

### 2026-10-05 · Startseite als Verzeichnis, Ton entpathetisiert
**Begründung:** Vorgabe: Die Seite soll zuerst eine vertrauenswürdige Zentrale sein, von der
aus alles auffindbar ist („Visitenkarte“ + Register), mit klarer, institutioneller, nüchterner
Sprache statt poetischem Ton. **Konsequenz:**
- Startseite (`src/pages/index.astro`) = Kopf (Name als Marke + faktische Rolle/Kanäle) →
  **Verzeichnis** aller Bereiche mit echten Zählern → Beleg (Explorationen, Projekte, Porträt).
- `SITE.statement` ist jetzt eine faktische Identitätszeile statt eines Leitsatzes.
- Das Motto *Gradatim Ferociter* verschwindet aus dem Footer (Chrome); in Dennis’ eigenen
  Texten (Exploration „warum-diese-website“, `ueber.mdx`, Thema Unternehmertum) bleibt es –
  das ist bewusste Autoren-Entscheidung, keine UI-Deko.
- Neue Copy-Regel in `docs/DESIGN.md` §6.

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
