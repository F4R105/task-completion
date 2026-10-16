import { router } from 'expo-router';

import { TaskForm } from '@/components/task-form';
import { useTasks } from '@/hooks/use-tasks';
import { useToday } from '@/hooks/use-today';
import { currentWorkYear } from '@/lib/dates';

export default function NewTaskScreen() {
  const today = useToday();
  const { tasks, addTask } = useTasks();

  return (
    <TaskForm
      initialValues={{ name: '', ...currentWorkYear(today), makeDefault: tasks.length === 0 }}
      submitLabel="Save task"
      onSubmit={({ makeDefault, ...task }) => {
        addTask(task, makeDefault);
        router.back();
      }}
    />
  );
}
