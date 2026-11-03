/**
 * Technische Konstanten der Website. Alles, was Dennis inhaltlich pflegt
 * (Name, Tätigkeit, Profile, Projekte), kommt aus INHALT.md – hier wird es
 * nur für Metadaten, JSON-LD und Navigation aufbereitet.
 */
import { getInhalt } from './lib/inhalt';

const inhalt = getInhalt();
const herkunft = inhalt.ort ? ` aus ${inhalt.ort}` : '';

export const SITE = {
  url: 'https://dennissteinmann.com',
  name: inhalt.name,
  lang: 'de',
  locale: 'de_DE',
  /** Meta-Description der Startseite. */
  description: `${inhalt.name} – ${inhalt.titel}${herkunft}.${inhalt.intro ? ` ${inhalt.intro}` : ''} Projekte und Kontakt.`,
  /** Identitätszeile (Standard-OG-Bild). */
  statement: `${inhalt.titel}${herkunft}.`,
  startYear: 2026,
} as const;

/** Die Person als Entität (JSON-LD Person, llms.txt). */
export const PERSON = {
  name: inhalt.name,
  givenName: inhalt.givenName,
  familyName: inhalt.familyName,
  jobTitle: inhalt.titel,
  description: `${inhalt.name} ist ${inhalt.titel}${herkunft}.`,
  homeLocation: inhalt.ort ?? 'Deutschland',
  nationality: 'Deutsch',
  email: inhalt.email,
};

/** Profile (LinkedIn, GitHub …) aus INHALT.md: Fußzeile, Startseite, JSON-LD `sameAs`. */
export type Channel = { name: string; url: string };
export const activeChannels = (): Channel[] => inhalt.profile;

export type NavItem = { label: string; href: string };

/** Hauptnavigation: bewusst minimal – die Startseite ist das Projektverzeichnis. */
export const NAV: NavItem[] = [{ label: 'Kontakt', href: '/kontakt/' }];

export const FOOTER_NAV: NavItem[] = [
  { label: 'Kontakt', href: '/kontakt/' },
  { label: 'Impressum', href: '/impressum/' },
  { label: 'Datenschutz', href: '/datenschutz/' },
];
