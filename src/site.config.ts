/**
 * Single Source of Truth für Identität, Navigation und Kanäle.
 * Alles, was an mehr als einer Stelle auftaucht, wird HIER gepflegt.
 */

export const SITE = {
  url: 'https://dennissteinmann.com',
  name: 'Dennis Steinmann',
  lang: 'de',
  locale: 'de_DE',
  description:
    'Dennis Steinmann denkt öffentlich nach – in Explorationen über Technologie, Unternehmertum, KI und Marken. Dazu alle Projekte, Medien und Presse an einem Ort.',
  /** Ein Satz, der auf der Startseite steht. */
  statement: 'Ich denke öffentlich nach – und baue, was dabei entsteht.',
  motto: 'Gradatim Ferociter',
  mottoTranslation: 'Schritt für Schritt, mit Entschlossenheit.',
  startYear: 2026,
} as const;

/**
 * Die Person als Entität (JSON-LD Person, Über, Presse, llms.txt).
 * Expertise wird NICHT hier gepflegt, sondern als Themen-Dateien in
 * src/content/topics/ – jede wird zu einer eigenen Experten-Seite.
 */
export const PERSON = {
  name: 'Dennis Steinmann',
  givenName: 'Dennis',
  familyName: 'Steinmann',
  jobTitle: 'Unternehmer, Produktentwickler und Autor',
  description:
    'Dennis Steinmann ist Unternehmer aus Deutschland. Er entwickelt Apps, Software und Marken und schreibt öffentlich über Technologie, Unternehmertum und künstliche Intelligenz.',
  homeLocation: 'Deutschland',
  nationality: 'Deutsch',
};

/**
 * Kanäle (Social Media & Profile). Einzige Quelle für:
 * Footer, Presse-Seite, JSON-LD `sameAs`, Studio-Übersicht.
 * TODO(dennis): URLs eintragen – Einträge ohne URL werden ignoriert.
 */
export type Channel = { id: string; name: string; url?: string; handle?: string };
export const CHANNELS: Channel[] = [
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'x', name: 'X' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/dennissteinmann', handle: 'dennissteinmann' },
];
export const activeChannels = () => CHANNELS.filter((c): c is Channel & { url: string } => !!c.url);

export type NavItem = { label: string; href: string; description?: string };

/** Hauptnavigation – bewusst kurz. */
export const NAV: NavItem[] = [
  { label: 'Explorationen', href: '/explorationen/', description: 'Langform-Gedanken, Theorien und Geschichten' },
  { label: 'Projekte', href: '/projekte/', description: 'Apps, Software, Unternehmen und Medien' },
  { label: 'Themen', href: '/themen/', description: 'Woran ich denke und wofür ich stehe' },
  { label: 'Medien', href: '/medien/', description: 'Bilder, Videos, Auftritte und Dokumente' },
  { label: 'Presse', href: '/presse/', description: 'Bio, Fotos, Fakten und Berichterstattung' },
  { label: 'Über', href: '/ueber/', description: 'Über Dennis Steinmann' },
];

export const FOOTER_NAV: NavItem[] = [
  { label: 'Logbuch', href: '/logbuch/' },
  { label: 'Kontakt', href: '/kontakt/' },
  { label: 'RSS', href: '/rss.xml' },
  { label: 'Impressum', href: '/impressum/' },
  { label: 'Datenschutz', href: '/datenschutz/' },
];
