// Shared by the build (initial value) and the browser (corrected for the visitor's local date).
const DAY = 86_400_000;
const toMs = (key: string) => Date.parse(`${key}T00:00:00Z`);
const toKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Consecutive days with notes ending today. A streak stays alive until the day ends, so
 *  "yesterday but not yet today" still counts. Keys are YYYY-MM-DD. */
export function currentStreak(days: Iterable<string>, today: string): number {
  const set = new Set(days);
  let cursor = toMs(today);
  if (!set.has(toKey(cursor))) cursor -= DAY;
  let n = 0;
  while (set.has(toKey(cursor))) {
    n++;
    cursor -= DAY;
  }
  return n;
}

export function longestStreak(days: Iterable<string>): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let prev = NaN;
  for (const key of sorted) {
    const ms = toMs(key);
    run = ms - prev === DAY ? run + 1 : 1;
    best = Math.max(best, run);
    prev = ms;
  }
  return best;
}
