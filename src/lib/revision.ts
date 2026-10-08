// Spaced revision. Runs in the browser; progress is kept in localStorage (per device/browser).
//
// A note is due for its first review the day after you learned it. Every time you mark it
// revised it moves up one stage and the gap before the next review grows. Marking it
// "need to revisit" sends it back to stage 0 (due tomorrow).

/** Days to wait before review number 1, 2, 3 ... Finishing the last one means "mastered". */
export const INTERVALS = [1, 3, 7, 14, 30, 60, 120];

const STORAGE_KEY = 'reviews';
const DAY = 86_400_000;

export interface Review {
  /** How many reviews are done (0 after "need to revisit") */
  stage: number;
  /** Day of the last review, YYYY-MM-DD in the reader's local time */
  last: string;
}
export type Reviews = Record<string, Review>;

export interface NoteRef {
  id: string;
  title: string;
  subject: string;
  hue: number;
  /** Day the note was written, YYYY-MM-DD */
  date: string;
}

export type Status = 'overdue' | 'today' | 'upcoming' | 'mastered';

export interface DueInfo extends NoteRef {
  status: Status;
  /** Day the next review is due, or null when mastered */
  due: string | null;
  stage: number;
  /** Positive = days overdue, negative = days until due */
  daysLate: number;
}

// ---------------------------------------------------------------- dates (YYYY-MM-DD keys)

const toMs = (key: string) => Date.parse(`${key}T00:00:00Z`);
const toKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const addDays = (key: string, n: number) => toKey(toMs(key) + n * DAY);
/** Whole days from a to b (b - a) */
export const daysBetween = (a: string, b: string) => Math.round((toMs(b) - toMs(a)) / DAY);

/** The reader's local calendar day */
export function localToday(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** "9 Oct" */
export function shortDate(key: string): string {
  return new Date(toMs(key)).toLocaleDateString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short' });
}

/** "today", "tomorrow", "in 5 days", "2 days ago" */
export function relativeDay(key: string, today: string): string {
  const d = daysBetween(today, key);
  if (d === 0) return 'today';
  if (d === 1) return 'tomorrow';
  if (d === -1) return 'yesterday';
  return d > 0 ? `in ${d} days` : `${-d} days ago`;
}

// ---------------------------------------------------------------- schedule

export function dueInfo(note: NoteRef, review: Review | undefined, today: string): DueInfo {
  const stage = review?.stage ?? 0;
  if (stage >= INTERVALS.length) return { ...note, status: 'mastered', due: null, stage, daysLate: 0 };

  const due = review ? addDays(review.last, INTERVALS[stage]) : addDays(note.date, INTERVALS[0]);
  const daysLate = daysBetween(due, today);
  const status: Status = daysLate > 0 ? 'overdue' : daysLate === 0 ? 'today' : 'upcoming';
  return { ...note, status, due, stage, daysLate };
}

/** Every note with its status, most urgent first (mastered notes last). */
export function scheduleAll(notes: NoteRef[], reviews: Reviews, today: string): DueInfo[] {
  return notes
    .map((n) => dueInfo(n, reviews[n.id], today))
    .sort((a, b) => (a.due ?? '9999').localeCompare(b.due ?? '9999') || b.date.localeCompare(a.date));
}

export const isDue = (d: DueInfo) => d.status === 'overdue' || d.status === 'today';

// ---------------------------------------------------------------- storage

export function loadReviews(): Reviews {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function saveReviews(reviews: Reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {}
}

/** Mark a note revised today. Clicking twice on the same day only counts once. */
export function markRevised(id: string, today: string): Reviews {
  const reviews = loadReviews();
  const current = reviews[id];
  if (!(current && current.last === today && current.stage > 0)) {
    reviews[id] = { stage: Math.min((current?.stage ?? 0) + 1, INTERVALS.length), last: today };
  }
  saveReviews(reviews);
  return reviews;
}

/** Didn't stick: start this note's schedule again (due tomorrow). */
export function markRevisit(id: string, today: string): Reviews {
  const reviews = loadReviews();
  reviews[id] = { stage: 0, last: today };
  saveReviews(reviews);
  return reviews;
}

// ---------------------------------------------------------------- page data

/** Notes list embedded in every page as <script type="application/json" id="notes-data"> */
export function readNotes(): NoteRef[] {
  try {
    return JSON.parse(document.getElementById('notes-data')?.textContent ?? '[]');
  } catch {
    return [];
  }
}

/** Updates the "Revise" badge in the header and the banner on the home page. */
export function refreshDueUI() {
  const due = scheduleAll(readNotes(), loadReviews(), localToday()).filter(isDue);
  document.querySelectorAll<HTMLElement>('[data-due-badge]').forEach((el) => {
    el.textContent = String(due.length);
    el.hidden = due.length === 0;
  });
  document.querySelectorAll<HTMLElement>('[data-due-banner]').forEach((el) => {
    el.hidden = due.length === 0;
    const n = el.querySelector('[data-due-count]');
    if (n) n.textContent = String(due.length);
    const label = el.querySelector('[data-due-label]');
    if (label) label.textContent = due.length === 1 ? 'note to revise today' : 'notes to revise today';
  });
}
