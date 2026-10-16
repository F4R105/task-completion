import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Task } from '@/lib/storage';

type TaskChipListProps = {
  tasks: Task[];
  selectedId: string | undefined;
  defaultTaskId: string | null;
  onSelect: (task: Task) => void;
  onEdit: (task: Task) => void;
  onAdd: () => void;
};

/** Horizontal task switcher. Tap to show a task, long-press to edit it. */
export function TaskChipList({
  tasks,
  selectedId,
  defaultTaskId,
  onSelect,
  onEdit,
  onAdd,
}: TaskChipListProps) {
  const theme = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
      {tasks.map((task) => {
        const selected = task.id === selectedId;
        return (
          <Pressable
            key={task.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityHint="Long-press to edit"
            onPress={() => onSelect(task)}
            onLongPress={() => onEdit(task)}
            style={[
              styles.chip,
              { backgroundColor: selected ? theme.accent : theme.backgroundElement },
            ]}>
            <ThemedText type="smallBold" style={selected && styles.selectedLabel}>
              {task.id === defaultTaskId ? '★ ' : ''}
              {task.name}
            </ThemedText>
          </Pressable>
        );
      })}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="New task"
        onPress={onAdd}
        style={[styles.chip, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          + New
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  chip: {
    paddingVertical: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
  },
  selectedLabel: {
    color: '#ffffff',
  },
});
