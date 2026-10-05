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
2. GitHub → Repo → *Settings → Secrets and variables → Actions* → Secrets:
   **✅ gesetzt (Stand 2026-10-05): `SSH_HOST`, `SSH_USER`, `SSH_PASSWORD`.**
   `SSH_PORT` optional (Standard 22). Namen müssen exakt so heißen – der Workflow
   überspringt den Deploy, wenn `SSH_HOST` fehlt.
3. Falls `REMOTE_PATH` abweicht: in `deploy.yml` anpassen (aktuell
   `htdocs/dennissteinmann.com`, relativ zum Home des `SSH_USER`).
4. Vhost einsetzen (siehe unten) → pushen → Actions-Tab beobachten.

### nginx-Vhost (CloudPanel → Site → Vhost)

Astro liefert statisches HTML (`/<pfad>/index.html`, `404.html`) – **kein PHP, kein
Varnish**. Der folgende Vhost ersetzt die PHP/Varnish-Vorlage vollständig und liefert
die Dateien direkt aus `{{root}}` (= `~/htdocs/dennissteinmann.com`, Deploy-Ziel).
Die `{{...}}`-Platzhalter füllt CloudPanel automatisch – **nicht entfernen**.

```nginx
# 1) www → ohne www (kanonisch)
server {
  listen 80;
  listen [::]:80;
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  {{ssl_certificate_key}}
  {{ssl_certificate}}
  server_name www.dennissteinmann.com;
  return 301 https://dennissteinmann.com$request_uri;
}

# 2) Hauptseite (statisch)
server {
  listen 80;
  listen [::]:80;
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  {{ssl_certificate_key}}
  {{ssl_certificate}}
  server_name dennissteinmann.com www1.dennissteinmann.com;
  {{root}}

  {{nginx_access_log}}
  {{nginx_error_log}}

  index index.html;
  charset utf-8;

  # HTTP → HTTPS
  if ($scheme != "https") {
    rewrite ^ https://$host$uri permanent;
  }

  # Let's Encrypt (Zertifikatserneuerung)
  location ~ /.well-known {
    auth_basic off;
    allow all;
  }

  {{settings}}

  # Slash-Konvention (Astro trailingSlash: 'always'):
  # /pfad → /pfad/ ; Dateien mit Endung (.xml/.txt/.md/.png …) bleiben unberührt.
  rewrite ^([^.]*[^/])$ $1/ permanent;

  # HTML-Seiten & Verzeichnis-Index
  location / {
    try_files $uri $uri/index.html $uri/ =404;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    # HSTS optional (erst aktivieren, wenn dauerhaft nur HTTPS gewünscht):
    # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  }

  # Gehashte Build-Assets: unveränderlich, 1 Jahr cachen
  location ^~ /_astro/ {
    add_header Access-Control-Allow-Origin "*";
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
    try_files $uri =404;
  }

  # Übrige statische Medien & Schriften
  location ~* \.(css|js|mjs|map|jpg|jpeg|gif|png|ico|svg|svgz|webp|avif|woff|woff2|ttf|otf|eot|mp4|webm|ogg|ogv|zip|gz)$ {
    add_header Access-Control-Allow-Origin "*";
    expires max;
    access_log off;
    try_files $uri =404;
  }

  # Maschinenlesbare Endpunkte: korrekte Typen, kurze Caches
  location ~* \.md$          { default_type text/markdown; charset utf-8; }
  location = /llms.txt      { default_type text/plain; charset utf-8; }
  location = /llms-full.txt { default_type text/plain; charset utf-8; }
  location = /sitemap.xml   { add_header Cache-Control "public, max-age=3600"; }
  location = /rss.xml       { add_header Cache-Control "public, max-age=3600"; }
  location = /robots.txt    { add_header Cache-Control "public, max-age=3600"; }

  # Eigene Fehlerseite
  error_page 404 /404.html;

  # Dotfiles / VCS schützen
  location ~ /\.(ht|svn|git|env) {
    deny all;
  }
}
```

**Hinweise:**
- Ist die Site in CloudPanel als PHP-Typ angelegt, kann dieser Vhost trotzdem eingesetzt
  werden (der `:8080`-PHP-Block entfällt ersatzlos). Sauberer ist der Typ *Static*.
- Zeigt `{{root}}` nicht auf das Deploy-Ziel, `REMOTE_PATH` in `deploy.yml` angleichen.

#### Redirects für geänderte URLs (nur im Notfall, siehe docs/SEO.md)

```nginx
# vor „location /“ einfügen:
# rewrite ^/explorationen/alter-slug/$ /explorationen/neuer-slug/ permanent;
```

## Rollback

`git revert <commit>` → push. Der vorherige Stand wird neu gebaut und deployed.
