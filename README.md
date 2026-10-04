# dennissteinmann.com

Persönliche Website von Dennis Steinmann – die Zentrale für Explorationen, Projekte,
Medien, Presse und Social Media. Statisch gebaut mit Astro, optimiert für klassische
Suche und KI-Suche, automatisch deployed bei Push auf `main`.

```bash
npm install
npm run dev                      # http://localhost:4321
npm run new exploration "Titel"  # auch: projekt | thema | log | medium | presse | seite
npm run verify                   # Build + SEO-Check
```

| Dokument | Inhalt |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Verbindliche Regeln für jede Änderung (Menschen & KI-Agenten) |
| [docs/DESIGN.md](docs/DESIGN.md) | Designsystem, Moodboard-Herleitung, Tokens |
| [docs/SEO.md](docs/SEO.md) | URL-Vertrag, Metadaten, strukturierte Daten, AI Search |
| [docs/CONTENT.md](docs/CONTENT.md) | Artikel, Projekte, Seiten, Medien pflegen |
| [docs/SOCIAL.md](docs/SOCIAL.md) | Vom Artikel zu Carousel & Post |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Lokal, GitHub Actions, Server, nginx |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Architekturentscheidungen |
