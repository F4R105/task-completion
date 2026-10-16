import { createContext, use, useState, type ReactNode } from 'react';

import { loadTasks, saveTasks, type Task, type TasksState } from '@/lib/storage';

type TasksContextValue = TasksState & {
  addTask: (input: Omit<Task, 'id'>, makeDefault: boolean) => Task;
  updateTask: (task: Task, makeDefault: boolean) => void;
  removeTask: (id: string) => void;
  /** Replaces every task, e.g. when restoring a backup or deleting all. */
  replaceAll: (state: TasksState) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  // Synchronous read, so the first frame already shows the saved tasks.
  const [state, setState] = useState(loadTasks);

  function commit(next: TasksState) {
    setState(next);
    saveTasks(next);
  }

  function addTask(input: Omit<Task, 'id'>, makeDefault: boolean) {
    const task = { ...input, id: newId() };
    commit({
      tasks: [...state.tasks, task],
      // The first task always becomes the default.
      defaultTaskId: makeDefault || !state.defaultTaskId ? task.id : state.defaultTaskId,
    });
    return task;
  }

  function updateTask(task: Task, makeDefault: boolean) {
    commit({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
      defaultTaskId: makeDefault ? task.id : state.defaultTaskId,
    });
  }

  function removeTask(id: string) {
    const tasks = state.tasks.filter((t) => t.id !== id);
    commit({
      tasks,
      defaultTaskId: state.defaultTaskId === id ? (tasks[0]?.id ?? null) : state.defaultTaskId,
    });
  }

  return (
    <TasksContext value={{ ...state, addTask, updateTask, removeTask, replaceAll: commit }}>
      {children}
    </TasksContext>
  );
}

export function useTasks() {
  const value = use(TasksContext);
  if (!value) {
    throw new Error('useTasks must be used inside <TasksProvider>');
  }
  return value;
}
