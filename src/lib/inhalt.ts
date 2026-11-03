/**
 * Liest INHALT.md – die eine Datei, aus der die gesamte Website entsteht
 * (Name, Tätigkeit, Profile, Unternehmen, Projekte, Werdegang …). Format:
 * siehe Kommentar oben in INHALT.md und docs/CONTENT.md.
 *
 * Bewusst ein kleines, fehlertolerantes Klartext-Format statt YAML: Es soll
 * sich auf dem Handy im GitHub-Editor pflegen lassen. Echte Fehler (kein
 * Name, Link ohne https) brechen den Build mit Zeilenangabe ab – so geht nie
 * eine kaputte Seite live.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Text mit optionalen Links – `[Text](https://…)` in der Datei. */
export type Inline = { text: string; href?: string }[];
export type Block = { type: 'p'; inline: Inline } | { type: 'ul'; items: Inline[] };

/** Ein Eintrag eines Abschnitts: Unternehmen, Projekt, Station im Werdegang … */
export type Eintrag = {
  id: string;
  titel: string;
  rolle?: string;
  zeit?: string;
  ort?: string;
  status?: string;
  link?: string;
  /** Anzeigeform des Links (Domain ohne www). */
  linkText?: string;
  text: Block[];
};

/** Ein Abschnitt („## Titel“): optionaler Einleitungstext + Einträge („### …“). */
export type Abschnitt = { id: string; titel: string; intro: Block[]; eintraege: Eintrag[] };

export type Profil = { name: string; url: string };

export type Inhalt = {
  name: string;
  givenName: string;
  familyName: string;
  /** Erste Zeile unter dem Namen, z. B. „Unternehmer und Produktentwickler“. */
  titel: string;
  intro?: string;
  ort?: string;
  email?: string;
  profile: Profil[];
  /** Einträge des Abschnitts „Projekte“ (für JSON-LD). */
  projekte: Eintrag[];
  /** Einträge des Abschnitts „Unternehmen“ (für JSON-LD). */
  unternehmen: Eintrag[];
  /** Nicht-leere Abschnitte in Dateireihenfolge. Leere Abschnitte fehlen hier. */
  abschnitte: Abschnitt[];
};

export const INHALT_DATEI = 'INHALT.md';

const KEY = /^([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß0-9 ._+-]{0,30}):\s+(\S.*)$/;
const URL_RE = /^https?:\/\/\S+$/;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const domain = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/** `[Text](https://…)` → Link-Segment, alles andere bleibt Text. */
function inline(text: string): Inline {
  const out: Inline = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[1], href: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** Freitextzeilen → Absätze und Aufzählungen. */
function bloecke(lines: string[]): Block[] {
  const out: Block[] = [];
  let para: string[] = [];
  let list: Inline[] | null = null;
  const flush = () => {
    if (para.length) out.push({ type: 'p', inline: inline(para.join(' ')) });
    if (list) out.push({ type: 'ul', items: list });
    para = [];
    list = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (para.length) { out.push({ type: 'p', inline: inline(para.join(' ')) }); para = []; }
      (list ??= []).push(inline(line.slice(2).trim()));
      continue;
    }
    if (list) { out.push({ type: 'ul', items: list }); list = null; }
    para.push(line);
  }
  flush();
  return out;
}

export function parseInhalt(source: string): Inhalt {
  // Kommentare und ein evtl. vom CMS geschriebener Frontmatter-Block werden
  // ausgeblendet; Zeilenumbrüche bleiben erhalten, damit Fehler-Zeilennummern stimmen.
  const blank = (m: string) => m.replace(/[^\n]/g, '');
  const text = source
    .replace(/\r\n?/g, '\n')
    .replace(/^---\n(?:[\s\S]*?\n)?---\n/, blank)
    .replace(/<!--[\s\S]*?-->/g, blank);
  const lines = text.split('\n');
  const fail = (n: number, msg: string): never => {
    throw new Error(`${INHALT_DATEI}, Zeile ${n + 1}: ${msg}`);
  };

  let name = '';
  const kopfText: string[] = [];
  let ort: string | undefined;
  let email: string | undefined;
  const profile: Profil[] = [];

  type Roh = { titel: string; lines: { n: number; s: string }[] };
  const sektionen: Roh[] = [];
  let sektion: Roh | null = null;

  lines.forEach((raw, n) => {
    const line = raw.trim();
    if (line.startsWith('# ')) {
      if (name) fail(n, 'Nur eine Zeile mit "# Name" ist erlaubt.');
      name = line.slice(2).trim();
      return;
    }
    if (line.startsWith('## ')) {
      sektion = { titel: line.slice(3).trim(), lines: [] };
      sektionen.push(sektion);
      return;
    }
    if (sektion) { sektion.lines.push({ n, s: raw }); return; }
    if (!line) return;
    if (!name) fail(n, 'Die Datei muss mit "# Name" beginnen.');
    const kv = line.match(KEY);
    if (kv) {
      const [, key, value] = kv;
      const k = key.toLowerCase();
      if (k === 'ort') { ort = value; return; }
      if (k === 'e-mail' || k === 'email' || k === 'mail') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fail(n, `"${value}" ist keine gültige E-Mail-Adresse.`);
        email = value;
        return;
      }
      if (URL_RE.test(value)) { profile.push({ name: key, url: value }); return; }
    }
    kopfText.push(line);
  });

  if (!name) throw new Error(`${INHALT_DATEI}: Es fehlt die Zeile "# Name" ganz oben.`);
  if (!kopfText.length) throw new Error(`${INHALT_DATEI}: Unter "# ${name}" fehlt die Zeile mit der Tätigkeit.`);

  const abschnitte: Abschnitt[] = [];
  const ids = new Set<string>();

  for (const s of sektionen) {
    const sid = slugify(s.titel) || 'abschnitt';
    const intro: string[] = [];
    const eintraege: Eintrag[] = [];
    let e: (Eintrag & { roh: string[] }) | null = null;
    const fertig = () => {
      if (e) { const { roh, ...rest } = e; eintraege.push({ ...rest, text: bloecke(roh) }); }
    };

    for (const { n, s: raw } of s.lines) {
      const line = raw.trim();
      if (line.startsWith('### ')) {
        fertig();
        const titel = line.slice(4).trim();
        if (!titel) fail(n, 'Eintrag ohne Titel.');
        // Anker möglichst kurz (#trusted-brands-ug); bei gleichem Titel in zwei
        // Abschnitten mit Abschnittsnamen davor (#werdegang-trusted-brands-ug).
        let id = slugify(titel) || 'eintrag';
        if (ids.has(id)) id = `${sid}-${id}`;
        if (ids.has(id)) fail(n, `"${titel}" gibt es in "${s.titel}" bereits – Titel bitte eindeutig wählen.`);
        ids.add(id);
        e = { id, titel, text: [], roh: [] };
        continue;
      }
      if (!e) { intro.push(raw); continue; }
      const kv = line.match(KEY);
      const k = kv?.[1].toLowerCase();
      if (kv && k === 'rolle') { e.rolle = kv[2]; continue; }
      if (kv && k === 'zeit') { e.zeit = kv[2]; continue; }
      if (kv && k === 'ort') { e.ort = kv[2]; continue; }
      if (kv && k === 'status') { e.status = kv[2]; continue; }
      if (kv && (k === 'link' || k === 'website' || k === 'url')) {
        if (!URL_RE.test(kv[2])) fail(n, `Link muss mit https:// beginnen: "${kv[2]}".`);
        e.link = kv[2];
        e.linkText = domain(kv[2]);
        continue;
      }
      e.roh.push(raw);
    }
    fertig();

    const introBloecke = bloecke(intro);
    if (introBloecke.length || eintraege.length) abschnitte.push({ id: sid, titel: s.titel, intro: introBloecke, eintraege });
  }

  const nach = (re: RegExp) => abschnitte.find((a) => re.test(a.titel))?.eintraege ?? [];
  const teile = name.split(/\s+/);
  return {
    name,
    givenName: teile.slice(0, -1).join(' ') || name,
    familyName: teile.length > 1 ? teile[teile.length - 1] : '',
    titel: kopfText[0],
    intro: kopfText.slice(1).join(' ') || undefined,
    ort,
    email,
    profile,
    projekte: nach(/^projekte$/i),
    unternehmen: nach(/^(unternehmen|firmen)$/i),
    abschnitte,
  };
}

/** Liest INHALT.md aus dem Projektordner (Build läuft immer von dort). */
export function getInhalt(): Inhalt {
  return parseInhalt(fs.readFileSync(path.join(process.cwd(), INHALT_DATEI), 'utf8'));
}

/** Flache Textfassung eines Inline-Textes (für Meta, JSON-LD, llms.txt). */
export const plain = (i: Inline) => i.map((s) => s.text).join('');
export const blockText = (b: Block[]) => b.map((x) => (x.type === 'p' ? plain(x.inline) : x.items.map(plain).join('; '))).join(' ');
