import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { todayKey } from '@/lib/dates';
import type { Task, TasksState } from '@/lib/storage';

const BACKUP_FORMAT = 'task-completion-backup';
const BACKUP_VERSION = 1;
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

type BackupFile = TasksState & {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
};

/** Writes the tasks to a JSON file and opens the share sheet (save to Files, email, Drive…). */
export async function exportBackup(state: TasksState) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }

  const backup: BackupFile = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    ...state,
  };
  const file = new File(Paths.cache, `task-completion-backup-${todayKey()}.json`);
  file.create({ overwrite: true });
  file.write(JSON.stringify(backup, null, 2));

  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/json',
    UTI: 'public.json',
    dialogTitle: 'Save task backup',
  });
}

function isTask(value: unknown): value is Task {
  const task = value as Task;
  return (
    typeof task === 'object' &&
    task !== null &&
    typeof task.id === 'string' &&
    typeof task.name === 'string' &&
    DATE_KEY.test(task.startDate) &&
    DATE_KEY.test(task.endDate)
  );
}

/**
 * Lets the user pick a backup file and returns its tasks, or `null` if they cancelled.
 * Throws if the file is not a valid backup.
 */
export async function pickBackup(): Promise<TasksState | null> {
  const result = await DocumentPicker.getDocumentAsync({
    // Some Android file providers report .json files as octet-stream.
    type: ['application/json', 'application/octet-stream', 'text/plain'],
    copyToCacheDirectory: true,
  });
  if (result.canceled) {
    return null;
  }

  let data: Partial<BackupFile>;
  try {
    data = JSON.parse(await new File(result.assets[0].uri).text());
  } catch {
    throw new Error('That file could not be read as a task backup.');
  }

  if (data.format !== BACKUP_FORMAT || !Array.isArray(data.tasks) || !data.tasks.every(isTask)) {
    throw new Error('That file is not a task backup from this app.');
  }

  const tasks = data.tasks;
  const defaultTaskId = tasks.some((t) => t.id === data.defaultTaskId)
    ? (data.defaultTaskId as string)
    : (tasks[0]?.id ?? null);
  return { tasks, defaultTaskId };
}
