/**
 * Komponenten, die in JEDER MDX-Datei ohne Import verfügbar sind.
 * Neue Autoren-Komponente? Hier registrieren + in docs/CONTENT.md dokumentieren.
 */
import Figure from './Figure.astro';
import Callout from './Callout.astro';
import Stats from './Stats.astro';
import Video from './Video.astro';

export const mdxComponents = { Figure, Callout, Stats, Video };
