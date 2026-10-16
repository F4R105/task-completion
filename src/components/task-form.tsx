import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { DateField } from '@/components/date-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { daysBetween, type DateKey } from '@/lib/dates';

export type TaskFormValues = {
  name: string;
  startDate: DateKey;
  endDate: DateKey;
  makeDefault: boolean;
};

type TaskFormProps = {
  initialValues: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => void;
  onDelete?: () => void;
};

export function TaskForm({ initialValues, submitLabel, onSubmit, onDelete }: TaskFormProps) {
  const theme = useTheme();
  const [values, setValues] = useState(initialValues);

  const span = daysBetween(values.startDate, values.endDate);
  const validDates = span > 0;
  const canSubmit = validDates && values.name.trim().length > 0;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.background }}>
      <View style={styles.field}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Task name
        </ThemedText>
        <TextInput
          value={values.name}
          onChangeText={(name) => setValues({ ...values, name })}
          placeholder="e.g. Quarterly audit"
          placeholderTextColor={theme.textSecondary}
          autoFocus={!initialValues.name}
          returnKeyType="done"
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        />
      </View>

      <View style={styles.field}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Period
        </ThemedText>
        <DateField
          label="Start"
          value={values.startDate}
          onChange={(startDate) => setValues({ ...values, startDate })}
        />
        <DateField
          label="Deadline (100%)"
          value={values.endDate}
          onChange={(endDate) => setValues({ ...values, endDate })}
        />
        {validDates ? (
          <ThemedText type="small" themeColor="textSecondary">
            {span + 1} calendar days
          </ThemedText>
        ) : (
          <ThemedText type="small" style={{ color: theme.danger }}>
            The deadline must be after the start date.
          </ThemedText>
        )}
      </View>

      <View style={[styles.switchRow, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText>Show this task when the app opens</ThemedText>
        <Switch
          value={values.makeDefault}
          onValueChange={(makeDefault) => setValues({ ...values, makeDefault })}
          trackColor={{ true: theme.accent }}
        />
      </View>

      <Button
        title={submitLabel}
        disabled={!canSubmit}
        onPress={() => onSubmit({ ...values, name: values.name.trim() })}
      />
      {onDelete && <Button title="Delete task" variant="danger" onPress={onDelete} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.two,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
});
