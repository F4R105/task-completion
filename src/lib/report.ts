import { formatDate, type DateKey } from '@/lib/dates';
import { expectedProgress, formatPercent } from '@/lib/progress';
import type { Task } from '@/lib/storage';

/**
 * Plain-text summary ready to paste into a weekly report, e.g.
 *
 *   Expected completion as of 16 Oct 2026
 *   • Quarterly audit — 29.6%
 */
export function buildReport(tasks: Task[], asOf: DateKey): string {
  const lines = tasks.map(
    (task) => `• ${task.name} — ${formatPercent(expectedProgress(task, asOf).percent)}%`
  );
  return [`Expected completion as of ${formatDate(asOf)}`, ...lines].join('\n');
}
