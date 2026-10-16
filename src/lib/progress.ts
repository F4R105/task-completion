import { daysBetween, type DateKey } from '@/lib/dates';

export type ProgressStatus = 'not-started' | 'in-progress' | 'done';

export type Progress = {
  /** Expected completion, 0–100. */
  percent: number;
  /** Calendar days counted so far, including the start day and `asOf`. */
  elapsed: number;
  /** Calendar days in the task period, including both start and end day. */
  total: number;
  status: ProgressStatus;
  /** Days from `asOf` until the start date (only meaningful when not started). */
  daysUntilStart: number;
  /** Days from `asOf` until the end date (only meaningful while in progress). */
  daysLeft: number;
};

/**
 * Expected completion if work is spread evenly over every calendar day from
 * `startDate` to `endDate` (both inclusive): the start day counts as day 1 and the
 * end day reaches 100%.
 */
export function expectedProgress(
  period: { startDate: DateKey; endDate: DateKey },
  asOf: DateKey
): Progress {
  const total = daysBetween(period.startDate, period.endDate) + 1;
  const day = daysBetween(period.startDate, asOf) + 1;
  const elapsed = Math.min(Math.max(day, 0), total);

  return {
    percent: (elapsed / total) * 100,
    elapsed,
    total,
    status: day <= 0 ? 'not-started' : day >= total ? 'done' : 'in-progress',
    daysUntilStart: daysBetween(asOf, period.startDate),
    daysLeft: daysBetween(asOf, period.endDate),
  };
}

/** One decimal place, dropping a trailing ".0" (29.6 → "29.6", 100 → "100"). */
export function formatPercent(percent: number): string {
  const text = percent.toFixed(1);
  return text.endsWith('.0') ? text.slice(0, -2) : text;
}
