import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { Button } from '@/components/button';
import { SegmentedControl } from '@/components/segmented-control';
import { SettingsSection } from '@/components/settings-section';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts, Spacing } from '@/constants/theme';
import { useSettings } from '@/hooks/use-settings';
import { useTasks } from '@/hooks/use-tasks';
import { useTheme } from '@/hooks/use-theme';
import { useToday } from '@/hooks/use-today';
import { exportBackup, pickBackup } from '@/lib/backup';
import { formatDate } from '@/lib/dates';
import { buildReport } from '@/lib/report';
import type { ProgressStyle, ThemePreference } from '@/lib/settings';

const THEME_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const satisfies readonly { value: ThemePreference; label: string }[];

const PROGRESS_OPTIONS = [
  { value: 'bar', label: 'Bar' },
  { value: 'ring', label: 'Ring' },
] as const satisfies readonly { value: ProgressStyle; label: string }[];

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default function SettingsScreen() {
  const theme = useTheme();
  const today = useToday();
  // The home screen passes its "As of" date so the report matches what is on screen.
  const { asOf: asOfParam } = useLocalSearchParams<{ asOf?: string }>();
  const asOf = asOfParam ?? today;

  const { tasks, defaultTaskId, replaceAll } = useTasks();
  const { theme: themePreference, progressStyle, reportExcludedIds, updateSettings } = useSettings();
  const [copied, setCopied] = useState(false);

  const reportTasks = tasks.filter((t) => !reportExcludedIds.includes(t.id));
  const report = buildReport(reportTasks, asOf);

  function setIncluded(id: string, included: boolean) {
    updateSettings({
      reportExcludedIds: included
        ? reportExcludedIds.filter((excluded) => excluded !== id)
        : [...reportExcludedIds, id],
    });
  }

  async function copyReport() {
    await Clipboard.setStringAsync(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleExport() {
    try {
      await exportBackup({ tasks, defaultTaskId });
    } catch (error) {
      Alert.alert('Export failed', errorMessage(error));
    }
  }

  async function handleImport() {
    try {
      const backup = await pickBackup();
      if (!backup) return;

      const restore = () => {
        replaceAll(backup);
        Alert.alert('Backup restored', `${backup.tasks.length} task(s) imported.`);
      };
      if (tasks.length === 0) {
        restore();
      } else {
        Alert.alert(
          'Replace your tasks?',
          `Your ${tasks.length} current task(s) will be replaced by the ${backup.tasks.length} in the backup.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Replace', style: 'destructive', onPress: restore },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Import failed', errorMessage(error));
    }
  }

  function handleDeleteAll() {
    Alert.alert('Delete all tasks?', 'This removes every task from this device and cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete all',
        style: 'destructive',
        onPress: () => replaceAll({ tasks: [], defaultTaskId: null }),
      },
    ]);
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          Settings
        </ThemedText>
        <Pressable accessibilityRole="button" hitSlop={Spacing.three} onPress={() => router.back()}>
          <ThemedText type="smallBold" style={[styles.done, { color: theme.accent }]}>
            Done
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} nestedScrollEnabled>
        <SettingsSection
          title="Report"
          footer={`Percentages as of ${formatDate(asOf)}, the date shown on the home screen.`}>
          {tasks.length === 0 ? (
            <ThemedText themeColor="textSecondary">Add a task to build a report.</ThemedText>
          ) : (
            <>
              <View style={[styles.preview, { backgroundColor: theme.background }]}>
                <ThemedText selectable style={styles.previewText}>
                  {report}
                </ThemedText>
              </View>
              {tasks.map((task) => (
                <View key={task.id} style={styles.row}>
                  <ThemedText style={styles.rowLabel} numberOfLines={1}>
                    {task.name}
                  </ThemedText>
                  <Switch
                    accessibilityLabel={`Include ${task.name} in report`}
                    value={!reportExcludedIds.includes(task.id)}
                    onValueChange={(included) => setIncluded(task.id, included)}
                    trackColor={{ true: theme.accent }}
                  />
                </View>
              ))}
              <Button
                title={copied ? 'Copied ✓' : 'Copy report'}
                disabled={reportTasks.length === 0}
                onPress={copyReport}
              />
            </>
          )}
        </SettingsSection>

        <SettingsSection
          title="Data"
          footer="Tasks are stored only on this device. Export a backup to keep a copy or move to a new phone.">
          <Button
            title="Export backup"
            variant="secondary"
            disabled={tasks.length === 0}
            onPress={handleExport}
            style={{ backgroundColor: theme.background }}
          />
          <Button
            title="Import backup"
            variant="secondary"
            onPress={handleImport}
            style={{ backgroundColor: theme.background }}
          />
          <Button
            title="Delete all tasks"
            variant="danger"
            disabled={tasks.length === 0}
            onPress={handleDeleteAll}
            style={{ backgroundColor: theme.background }}
          />
        </SettingsSection>

        <SettingsSection title="Look">
          <ThemedText type="small" themeColor="textSecondary">
            Theme
          </ThemedText>
          <SegmentedControl
            options={THEME_OPTIONS}
            value={themePreference}
            onChange={(value) => updateSettings({ theme: value })}
          />
          <ThemedText type="small" themeColor="textSecondary">
            Progress style
          </ThemedText>
          <SegmentedControl
            options={PROGRESS_OPTIONS}
            value={progressStyle}
            onChange={(value) => updateSettings({ progressStyle: value })}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <View style={styles.row}>
            <ThemedText>Version</ThemedText>
            <ThemedText themeColor="textSecondary">{Constants.expoConfig?.version ?? '—'}</ThemedText>
          </View>
          <View style={styles.about}>
            <ThemedText type="smallBold">How the percentage is calculated</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Expected completion assumes work is spread evenly over every calendar day of the task,
              counting both the start date and the deadline. The start date is day 1 and the
              deadline is 100%.
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Example: 1 Jul 2026 → 30 Jun 2027 has 365 days. On 16 Oct 2026 it is day 108, so
              108 ÷ 365 = 29.6%.
            </ThemedText>
          </View>
        </SettingsSection>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  done: {
    fontSize: 16,
  },
  content: {
    padding: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.four,
  },
  preview: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  previewText: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  rowLabel: {
    flex: 1,
  },
  about: {
    gap: Spacing.two,
  },
});
