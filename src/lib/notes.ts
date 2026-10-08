import { getCollection, type CollectionEntry } from 'astro:content';
import { subjectHues } from '../config';
import { currentStreak, longestStreak } from './streak';

export type Note = CollectionEntry<'entries'>;

const DAY = 86_400_000;

export const KIND_LABEL: Record<string, string> = {
  study: 'Study',
  build: 'Build',
  practice: 'Practice',
  read: 'Read',
  idea: 'Idea',
};

// ---------------------------------------------------------------- dates
// `date` is a calendar day with no timezone. It is stored as UTC midnight, so it must
// always be read back in UTC or it can slip to the neighbouring day.

export const dayKey = (d: Date) => d.toISOString().slice(0, 10);
export const monthKey = (d: Date) => d.toISOString().slice(0, 7);

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) =>
  d.toLocaleDateString('en-GB', { timeZone: 'UTC', ...o });

export const fmtLong = (d: Date) =>
  fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const fmtMedium = (d: Date) => fmt(d, { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtMonthYear = (d: Date) => fmt(d, { month: 'short', year: 'numeric' });
export const fmtWeekday = (d: Date) => fmt(d, { weekday: 'short' });
export const fmtMonth = (d: Date) => fmt(d, { month: 'long' });
export const fmtDayNum = (d: Date) => fmt(d, { day: '2-digit' });

/** "14:30" -> "2:30 PM" */
export function fmtTime(t?: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

/** 95 -> "1h 35m" */
export function fmtDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ---------------------------------------------------------------- notes

const sortKey = (n: Note) => `${dayKey(n.data.date)} ${(n.data.time ?? '00:00').padStart(5, '0')}`;

/** All published notes, newest first. Drafts are visible only in `npm run dev`. */
export async function getNotes(): Promise<Note[]> {
  const all = await getCollection('entries', ({ data }) => import.meta.env.DEV || !data.draft);
  const sorted = all.sort((a, b) => sortKey(b).localeCompare(sortKey(a)) || a.id.localeCompare(b.id));
  assignHues(sorted);
  return sorted;
}

export function readingTime(n: Note): number {
  const words = (n.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Markdown -> plain text. Code blocks are dropped unless `keepCode` is set (the search index keeps them). */
export function plainText(md: string, keepCode = false): string {
  return md
    .replace(/```[\s\S]*?```/g, (block) => (keepCode ? block.replace(/^```.*$/gm, ' ') : ' '))
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>~|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The frontmatter summary, or an excerpt taken from the first real paragraph of the body. */
export function summaryOf(n: Note, max = 190): string {
  if (n.data.summary) return n.data.summary;
  const body = n.body ?? '';
  // Skip headings, lists, quotes, tables, code and images; prefer the first prose paragraph.
  const prose = body.split(/\n\s*\n/).find((b) => !/^\s*(#|>|\||```|[-*+]\s|\d+[.)]\s|!\[|<)/.test(b));
  const text = plainText(prose ?? body.replace(/^\s*([-*+]|\d+[.)])\s+(\[[ xX]\]\s+)?/gm, ''));
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text;
}

// ---------------------------------------------------------------- subjects

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'misc';

const hueOverrides = Object.fromEntries(
  Object.entries(subjectHues).map(([name, hue]) => [slugify(name), hue]),
);

const hueBySlug = new Map<string, number>();

/** Spread colours evenly (golden angle) in the order subjects first appear, oldest first.
 *  A subject keeps its colour as newer subjects are added. Pin one in config.ts to fix it. */
function assignHues(newestFirst: Note[]) {
  hueBySlug.clear();
  let n = 0;
  for (const note of [...newestFirst].reverse()) {
    const slug = slugify(note.data.subject);
    if (slug in hueOverrides || hueBySlug.has(slug)) continue;
    hueBySlug.set(slug, Math.round(((255 + n++ * 137.508) % 360) * 10) / 10);
  }
}

export function subjectHue(subject: string): number {
  const slug = slugify(subject);
  if (slug in hueOverrides) return hueOverrides[slug];
  if (hueBySlug.has(slug)) return hueBySlug.get(slug)!;
  let h = 5381; // fallback if called before getNotes()
  for (const ch of slug) h = ((h << 5) + h + ch.codePointAt(0)!) >>> 0;
  return h % 360;
}

export interface Subject {
  slug: string;
  name: string;
  hue: number;
  notes: Note[];
  first: Date;
  last: Date;
  minutes: number;
}

/** Subjects ordered by number of notes. Notes must already be sorted newest first. */
export function getSubjects(notes: Note[]): Subject[] {
  const map = new Map<string, Subject>();
  for (const n of notes) {
    const slug = slugify(n.data.subject);
    let s = map.get(slug);
    if (!s) {
      // The newest note decides how the subject name is capitalised.
      s = { slug, name: n.data.subject.trim(), hue: subjectHue(n.data.subject), notes: [], first: n.data.date, last: n.data.date, minutes: 0 };
      map.set(slug, s);
    }
    s.notes.push(n);
    s.minutes += n.data.duration ?? 0;
    if (n.data.date < s.first) s.first = n.data.date;
    if (n.data.date > s.last) s.last = n.data.date;
  }
  return [...map.values()].sort((a, b) => b.notes.length - a.notes.length || a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------- timeline grouping

export interface DayGroup {
  key: string;
  date: Date;
  notes: Note[];
  minutes: number;
}
export interface MonthGroup {
  key: string;
  date: Date;
  days: DayGroup[];
  count: number;
}
export interface YearGroup {
  year: number;
  months: MonthGroup[];
}

/** Year > month > day, newest first. Notes must already be sorted newest first. */
export function groupTimeline(notes: Note[]): YearGroup[] {
  const years: YearGroup[] = [];
  for (const n of notes) {
    const date = n.data.date;
    const year = date.getUTCFullYear();
    let y = years.at(-1);
    if (!y || y.year !== year) years.push((y = { year, months: [] }));

    let m = y.months.at(-1);
    if (!m || m.key !== monthKey(date)) y.months.push((m = { key: monthKey(date), date, days: [], count: 0 }));

    let d = m.days.at(-1);
    if (!d || d.key !== dayKey(date)) m.days.push((d = { key: dayKey(date), date, notes: [], minutes: 0 }));

    d.notes.push(n);
    d.minutes += n.data.duration ?? 0;
    m.count++;
  }
  return years;
}

// ---------------------------------------------------------------- stats + heatmap

export function getStats(notes: Note[], subjects: Subject[]) {
  const days = [...new Set(notes.map((n) => dayKey(n.data.date)))];
  const minutes = notes.reduce((sum, n) => sum + (n.data.duration ?? 0), 0);
  return {
    notes: notes.length,
    days,
    subjects: subjects.length,
    minutes,
    streak: currentStreak(days, new Date().toISOString().slice(0, 10)),
    longest: longestStreak(days),
  };
}

export interface HeatCell {
  key: string;
  count: number;
  beyond: boolean; // after the last day shown (pads the final week)
}

/** A GitHub-style grid: `weeks` columns of 7 days, Monday first, ending on the latest day. */
export function buildHeatmap(notes: Note[], weeks = 53) {
  const counts = new Map<string, number>();
  for (const n of notes) counts.set(dayKey(n.data.date), (counts.get(dayKey(n.data.date)) ?? 0) + 1);

  // Whichever is later, today (UTC build time) or the newest note, so a note dated "tomorrow"
  // in the writer's timezone is never cut off.
  const today = Date.parse(new Date().toISOString().slice(0, 10));
  const newest = notes.length ? Date.parse(dayKey(notes[0].data.date)) : 0;
  const end = Math.max(today, newest);
  const mondayIndex = (new Date(end).getUTCDay() + 6) % 7;
  const gridEnd = end + (6 - mondayIndex) * DAY;
  const gridStart = gridEnd - (weeks * 7 - 1) * DAY;

  const columns: HeatCell[][] = [];
  let total = 0;
  for (let w = 0; w < weeks; w++) {
    const col: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const ms = gridStart + (w * 7 + d) * DAY;
      const key = new Date(ms).toISOString().slice(0, 10);
      const count = counts.get(key) ?? 0;
      if (ms <= end) total += count;
      col.push({ key, count, beyond: ms > end });
    }
    columns.push(col);
  }

  // Month labels sit above the first column where a new month begins.
  const labels: { col: number; text: string }[] = [];
  let prevMonth = -1;
  columns.forEach((col, i) => {
    const date = new Date(Date.parse(col[0].key));
    const month = date.getUTCMonth();
    if (month !== prevMonth) {
      labels.push({ col: i, text: date.toLocaleDateString('en-GB', { timeZone: 'UTC', month: 'short' }) });
      prevMonth = month;
    }
  });
  if (labels.length > 1 && labels[1].col - labels[0].col < 3) labels.shift();

  return { columns, labels, total };
}
