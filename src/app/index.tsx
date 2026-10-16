import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { DateField } from '@/components/date-field';
import { IconButton } from '@/components/icon-button';
import { PercentDisplay } from '@/components/percent-display';
import { TaskChipList } from '@/components/task-chip-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useSettings } from '@/hooks/use-settings';
import { useTasks } from '@/hooks/use-tasks';
import { useTheme } from '@/hooks/use-theme';
import { useToday } from '@/hooks/use-today';
import { formatDate, type DateKey } from '@/lib/dates';
import { expectedProgress } from '@/lib/progress';
import type { Task } from '@/lib/storage';

function openNewTask() {
  router.push('/task/new');
}

function openEditTask(task: Task) {
  router.push({ pathname: '/task/[id]', params: { id: task.id } });
}

function SettingsButton({ asOf }: { asOf: DateKey }) {
  const theme = useTheme();
  return (
    <View style={styles.topBar}>
      {/* Filled circle with a soft halo, in the style of Expo Go's tools button. */}
      <View style={[styles.halo, { backgroundColor: theme.backgroundElement }]}>
        <IconButton
          icon={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
          label="Settings"
          onPress={() => router.push({ pathname: '/settings', params: { asOf } })}
          backgroundColor={theme.textSecondary}
          tintColor={theme.background}
        />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const today = useToday();
  const { tasks, defaultTaskId } = useTasks();
  const { progressStyle } = useSettings();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // null means "follow today", so the number stays current across days.
  const [pickedDate, setPickedDate] = useState<DateKey | null>(null);

  const asOf = pickedDate ?? today;
  const task =
    tasks.find((t) => t.id === selectedId) ??
    tasks.find((t) => t.id === defaultTaskId) ??
    tasks[0];

  if (!task) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <SettingsButton asOf={asOf} />
          <View style={styles.empty}>
            <ThemedText type="subtitle" style={styles.center}>
              No tasks yet
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.center}>
              Add a task with its start date and deadline to see how far along it should be today.
            </ThemedText>
            <Button title="Create your first task" onPress={openNewTask} />
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <SettingsButton asOf={asOf} />
        <View style={styles.header}>
          <ThemedText type="small" themeColor="textSecondary">
            EXPECTED COMPLETION
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Edit this task"
            onPress={() => openEditTask(task)}
            style={styles.titleRow}>
            <ThemedText type="subtitle" numberOfLines={2} style={styles.center}>
              {task.name}
            </ThemedText>
          </Pressable>
          <ThemedText themeColor="textSecondary">
            {formatDate(task.startDate)} → {formatDate(task.endDate)}
          </ThemedText>
        </View>

        <View style={styles.hero}>
          <PercentDisplay progress={expectedProgress(task, asOf)} variant={progressStyle} />
        </View>

        <View style={styles.asOf}>
          {/* The pill resizes smoothly as the reset button zooms in and out beside it. */}
          <Animated.View style={styles.asOfField} layout={LinearTransition.duration(200)}>
            <DateField
              label="As of"
              value={asOf}
              valueLabel={pickedDate ? undefined : `Today, ${formatDate(today)}`}
              onChange={(date) => setPickedDate(date === today ? null : date)}
              style={styles.asOfPill}
            />
          </Animated.View>
          {pickedDate && (
            <Animated.View entering={ZoomIn.duration(200)} exiting={ZoomOut.duration(150)}>
              <IconButton
                icon={{ ios: 'arrow.counterclockwise', android: 'replay', web: 'replay' }}
                label="Reset to today"
                onPress={() => setPickedDate(null)}
                size={52}
                backgroundColor={theme.backgroundElement}
                tintColor={theme.accent}
              />
            </Animated.View>
          )}
        </View>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <TaskChipList
          tasks={tasks}
          selectedId={task.id}
          defaultTaskId={defaultTaskId}
          onSelect={(t) => setSelectedId(t.id)}
          onEdit={openEditTask}
          onAdd={openNewTask}
        />
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          Tap a task to switch · long-press to edit
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  topBar: {
    alignItems: 'flex-end',
  },
  halo: {
    padding: Spacing.one,
    borderRadius: 999,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  titleRow: {
    alignSelf: 'stretch',
  },
  center: {
    textAlign: 'center',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  asOf: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  asOfField: {
    flex: 1,
  },
  asOfPill: {
    borderRadius: 999,
    paddingHorizontal: Spacing.four,
  },
  footer: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
});
