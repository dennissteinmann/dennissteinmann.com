/**
 * Single Source of Truth für Identität, Navigation und Profile.
 * Alles, was an mehr als einer Stelle auftaucht (Name, Profile, Navigation,
 * Motto), wird HIER gepflegt und nirgendwo sonst hart codiert.
 */

export const SITE = {
  url: 'https://dennissteinmann.com',
  name: 'Dennis Steinmann',
  /** Kurzform für <title>-Suffix und OG-Bilder */
  shortName: 'Steinmann',
  lang: 'de',
  locale: 'de_DE',
  /** Standard-Meta-Description (Startseite / Fallback) */
  description:
    'Dennis Steinmann dokumentiert öffentlich den Aufbau seiner Projekte: Apps, Software, Unternehmen und Personal Brand. Langform-Artikel, Logbuch und Lernnotizen.',
  tagline: 'Fortschritt, öffentlich dokumentiert.',
  motto: 'Gradatim Ferociter',
  mottoTranslation: 'Schritt für Schritt, mit Entschlossenheit.',
  startYear: 2026,
} as const;

/**
 * Die Person als Entität. Wird für JSON-LD (Person), die Über-Seite und
 * llms.txt verwendet. `sameAs` ist für Suchmaschinen und KI-Systeme das
 * wichtigste Signal, um alle Profile derselben Person zuzuordnen.
 */
export const PERSON = {
  name: 'Dennis Steinmann',
  givenName: 'Dennis',
  familyName: 'Steinmann',
  jobTitle: 'Unternehmer & Produktentwickler',
  description:
    'Unternehmer aus Deutschland. Baut Apps, Software-Produkte und Marken und teilt den Weg dorthin öffentlich.',
  homeLocation: 'Deutschland',
  knowsAbout: [
    'Mobile Apps',
    'Softwareentwicklung',
    'Unternehmertum',
    'Personal Branding',
    'Suchmaschinenoptimierung',
    'Künstliche Intelligenz',
  ],
  /**
   * TODO(dennis): echte Profil-URLs eintragen. Nur Profile, die dir gehören
   * und aktiv gepflegt werden. Leere Einträge werden automatisch ignoriert.
   */
  sameAs: [
    // 'https://www.linkedin.com/in/…',
    // 'https://www.instagram.com/…',
    // 'https://x.com/…',
    // 'https://github.com/dennissteinmann',
    // 'https://www.youtube.com/@…',
  ] as string[],
};

export type NavItem = { label: string; href: string; description?: string };

/** Hauptnavigation – Reihenfolge = Priorität. Max. 6 Einträge. */
export const NAV: NavItem[] = [
  { label: 'Artikel', href: '/artikel/', description: 'Langform: Analysen, Anleitungen, Erfahrungen' },
  { label: 'Projekte', href: '/projekte/', description: 'Alles, woran ich baue – mit Status' },
  { label: 'Logbuch', href: '/logbuch/', description: 'Kurze Fortschrittsnotizen' },
  { label: 'Themen', href: '/themen/', description: 'Alle Inhalte nach Thema' },
  { label: 'Über', href: '/ueber/', description: 'Wer ich bin und woran ich glaube' },
];

/** Footer-Navigation (rechtliche Seiten + Utility) */
export const FOOTER_NAV: NavItem[] = [
  { label: 'Kontakt', href: '/kontakt/' },
  { label: 'RSS', href: '/rss.xml' },
  { label: 'Impressum', href: '/impressum/' },
  { label: 'Datenschutz', href: '/datenschutz/' },
];
