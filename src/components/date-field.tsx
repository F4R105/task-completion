import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, fromDateKey, toDateKey, type DateKey } from '@/lib/dates';

type DateFieldProps = {
  label: string;
  value: DateKey;
  onChange: (value: DateKey) => void;
  /** Shown instead of the formatted date, e.g. "Today". */
  valueLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** A labelled row that opens the platform date picker. */
export function DateField({ label, value, onChange, valueLabel, style }: DateFieldProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.backgroundElement }, style]}>
      <ThemedText themeColor="textSecondary">{label}</ThemedText>
      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={fromDateKey(value)}
          mode="date"
          display="compact"
          onValueChange={(_, date) => onChange(toDateKey(date))}
        />
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${formatDate(value)}`}
          hitSlop={Spacing.two}
          onPress={() =>
            DateTimePickerAndroid.open({
              value: fromDateKey(value),
              mode: 'date',
              onValueChange: (_, date) => onChange(toDateKey(date)),
            })
          }>
          <ThemedText type="smallBold" style={[styles.value, { color: theme.accent }]}>
            {valueLabel ?? formatDate(value)}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  value: {
    fontSize: 16,
  },
});
