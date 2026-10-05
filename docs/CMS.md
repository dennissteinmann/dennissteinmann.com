# CMS – Inhalte pflegen

Git-basiert (Sveltia CMS). Kein Server, keine Datenbank, kein Vendor-Lock-in: Inhalte bleiben
MDX im Repo. **Speichern = Commit = automatisches Deploy** (`deploy.yml`). Nicht öffentlich
(noindex + in `robots.txt` gesperrt). Dateien: `public/admin/`.

**Projekte und Unternehmen sind dieselbe Collection** – das Feld **Art** (`kind`) unterscheidet
(`unternehmen` = Firma, `app`/`website`/… = Produkt). Kein zweites Verzeichnis nötig.

## Variante A – lokal, ohne Einrichtung (sofort nutzbar)

1. `npm run dev`
2. http://localhost:4321/admin/ öffnen (Chrome oder Edge).
3. **„Work with Local Repository"** wählen, Projektordner freigeben.
4. Bearbeiten, speichern (schreibt direkt die MDX-Dateien).
5. Fertig? `git add -A && git commit -m "Inhalt" && git push` → geht live.

Nichts einzurichten, nichts von außen erreichbar – ideal für die eigene Maschine.

## Variante B – von überall (Browser/Handy, optional)

Bearbeiten über GitHub-Login auf `https://dennissteinmann.com/admin/`. Einmalig nötig:

1. **GitHub OAuth App** (github.com → Settings → Developer settings → OAuth Apps → New):
   - Homepage: `https://dennissteinmann.com`
   - Callback: die URL des Auth-Workers aus Schritt 2 + `/callback`
   - Client-ID & Secret notieren.
2. **Auth-Helfer** (klein, kostenlos): `sveltia-cms-auth` auf einen Cloudflare Worker deployen
   (Repo: `sveltia/sveltia-cms-auth`), Client-ID/Secret dort als Variablen setzen.
3. In `public/admin/config.yml` → `backend.base_url` auf die Worker-URL setzen, pushen.

Danach: `/admin/` → „Sign in with GitHub" → Commits laufen auf `main` → Deploy.

## Felder & Regeln

- **Slug** = URL-Teil, **nie ändern** (SEO-Vertrag, siehe `docs/SEO.md`). Nur Kleinbuchstaben
  und Bindestriche.
- **Meta-Description** 70–165 Zeichen, **Kurzfassung** min. 60 (Projekt) bzw. 120 (Exploration) –
  das erzwingt der Build; das CMS warnt schon beim Tippen.
- **Entwurf** (`draft`) an = nur lokal sichtbar, nie live. Zum Veröffentlichen ausschalten.
- **Hervorheben** (`featured`) bei Projekten = erscheint vorne auf der Startseite.
- Bilder liegen **neben** dem Text (co-lokal). Sollte Astro einen Bildpfad nicht finden, im
  Frontmatter ein `./` voranstellen (z. B. `cover: ./cover.webp`).

## Konfiguration pflegen

Neues Feld im Schema (`src/content.config.ts`) → entsprechend in `public/admin/config.yml`
ergänzen (gleiche Feldnamen). Sveltia-Version ist in `public/admin/index.html` gepinnt.
