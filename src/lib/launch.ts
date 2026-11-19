/**
 * Platzhalter-Modus (docs/DEPLOYMENT.md): aktiv im Produktions-Build, solange
 * `LAUNCHED` in src/site.config.ts `false` ist. Im Dev-Server bleibt die
 * vollständige Seite sichtbar – wie Entwürfe.
 */
import { LAUNCHED } from '@/site.config';

export const PLACEHOLDER = !LAUNCHED && import.meta.env.PROD;
