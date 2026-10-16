/**
 * Dates are handled as calendar-day strings ("YYYY-MM-DD") so storage is lossless and
 * day counts can never drift because of time zones or daylight saving changes.
 */
export type DateKey = string;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function parts(key: DateKey) {
  const [year, month, day] = key.split('-').map(Number);
  return { year, month, day };
}

/** The local calendar day of a `Date`. */
export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local midnight of a calendar day, for use with date pickers. */
export function fromDateKey(key: DateKey): Date {
  const { year, month, day } = parts(key);
  return new Date(year, month - 1, day);
}

export function todayKey(): DateKey {
  return toDateKey(new Date());
}

/** Whole calendar days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: DateKey, to: DateKey): number {
  const a = parts(from);
  const b = parts(to);
  return Math.round(
    (Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day)) / MS_PER_DAY
  );
}

/** The work year (1 July → 30 June) that contains `date`. */
export function currentWorkYear(date: DateKey) {
  const { year, month } = parts(date);
  const startYear = month >= 7 ? year : year - 1;
  return { startDate: `${startYear}-07-01`, endDate: `${startYear + 1}-06-30` };
}

/** e.g. "16 Oct 2026" (order follows the device locale). */
export function formatDate(key: DateKey): string {
  return fromDateKey(key).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
