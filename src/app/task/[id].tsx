import { router, useLocalSearchParams } from 'expo-router';
import { Alert, StyleSheet } from 'react-native';

import { TaskForm } from '@/components/task-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, defaultTaskId, updateTask, removeTask } = useTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <ThemedView style={styles.missing}>
        <ThemedText themeColor="textSecondary">This task no longer exists.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <TaskForm
      initialValues={{ ...task, makeDefault: task.id === defaultTaskId }}
      submitLabel="Save changes"
      onSubmit={({ makeDefault, ...values }) => {
        updateTask({ ...values, id: task.id }, makeDefault);
        router.back();
      }}
      onDelete={() =>
        Alert.alert('Delete task?', `"${task.name}" will be removed from this device.`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              router.back();
              removeTask(task.id);
            },
          },
        ])
      }
    />
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.five,
  },
});
