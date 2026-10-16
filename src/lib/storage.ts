import Storage from 'expo-sqlite/kv-store';

import type { DateKey } from '@/lib/dates';

/**
 * Tasks live on this device only, in the app's private SQLite key-value store.
 * The expected percentage is never stored; it is always derived from the dates.
 */
export type Task = {
  id: string;
  name: string;
  startDate: DateKey;
  endDate: DateKey;
};

export type TasksState = {
  tasks: Task[];
  defaultTaskId: string | null;
};

const TASKS_KEY = 'tasks';
const DEFAULT_TASK_KEY = 'defaultTaskId';

export function loadTasks(): TasksState {
  try {
    const raw = Storage.getItemSync(TASKS_KEY);
    return {
      tasks: raw ? (JSON.parse(raw) as Task[]) : [],
      defaultTaskId: Storage.getItemSync(DEFAULT_TASK_KEY),
    };
  } catch (error) {
    console.warn('Could not load tasks', error);
    return { tasks: [], defaultTaskId: null };
  }
}

export function saveTasks(state: TasksState) {
  Storage.setItemSync(TASKS_KEY, JSON.stringify(state.tasks));
  if (state.defaultTaskId) {
    Storage.setItemSync(DEFAULT_TASK_KEY, state.defaultTaskId);
  } else {
    Storage.removeItemSync(DEFAULT_TASK_KEY);
  }
}
