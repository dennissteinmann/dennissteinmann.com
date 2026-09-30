# Lokal entwickeln & Deployment

## Lokal

```bash
nvm use            # Node 24 (siehe .nvmrc), mind. 22
npm install
npm run dev        # http://localhost:4321 – Hot Reload, Entwürfe sichtbar
npm run verify     # Produktions-Build + SEO-Check (so wie in CI)
npm run preview    # fertigen Build lokal ansehen
```

## Deployment: Push = Live

`.github/workflows/deploy.yml` (gleiches Muster wie `sinnapps-website`):

1. **build** – bei jedem Push & Pull Request: `npm ci` → `npm run build` (inkl.
   Typ-/Schema-Check) → `scripts/check-dist.mjs` (SEO-Check). Fehler = kein Deploy.
2. **deploy** – nur bei Push auf `main`: `dist/` per `rsync --delete` über SSH
   (sshpass) nach `~/htdocs/dennissteinmann.com` auf dem CloudPanel-Server.

Solange die Secrets fehlen, läuft nur der Build (Deploy wird mit Warnung übersprungen).

### Einmalige Einrichtung

1. In CloudPanel eine **Static HTML Site** für `dennissteinmann.com` anlegen
   (+ Let's-Encrypt-Zertifikat, Weiterleitung `www` → ohne `www`).
2. GitHub → Repo → *Settings → Secrets and variables → Actions* → Secrets anlegen:

   | Secret | Wert |
   |---|---|
   | `SSH_HOST` | Server-IP oder Hostname |
   | `SSH_USER` | Site-User aus CloudPanel |
   | `SSH_PASSWORD` | Passwort des Site-Users |
   | `SSH_PORT` | optional, Standard 22 |

3. Falls `REMOTE_PATH` abweicht: in `deploy.yml` anpassen.
4. Pushen → Actions-Tab beobachten.

### nginx (CloudPanel → Site → Vhost)

Astro erzeugt `/<pfad>/index.html` und `404.html`. Empfohlene Ergänzungen im Vhost:

```nginx
# Kanonische Slash-Konvention: /artikel/foo → /artikel/foo/
location / {
  try_files $uri $uri/index.html $uri/ =404;
}
rewrite ^([^.]*[^/])$ $1/ permanent;

error_page 404 /404.html;

# Lange Caches für gehashte Assets, kurze für HTML
location /_astro/ { expires 1y; add_header Cache-Control "public, immutable"; }
location ~* \.(png|jpg|jpeg|webp|avif|svg|woff2|mp4)$ { expires 30d; }
location ~* \.md$ { default_type text/markdown; charset utf-8; }
location = /llms.txt { default_type text/plain; charset utf-8; }
location = /llms-full.txt { default_type text/plain; charset utf-8; }

# Sicherheit
add_header X-Content-Type-Options nosniff;
add_header Referrer-Policy strict-origin-when-cross-origin;

# ── Redirects für geänderte URLs (nur im Notfall, siehe docs/SEO.md) ──
# rewrite ^/artikel/alter-slug/$ /artikel/neuer-slug/ permanent;
```

## Rollback

`git revert <commit>` → push. Der vorherige Stand wird neu gebaut und deployed.
