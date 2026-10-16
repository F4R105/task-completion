import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPercent, type Progress } from '@/lib/progress';

function caption(progress: Progress) {
  switch (progress.status) {
    case 'not-started':
      return `Starts in ${progress.daysUntilStart} ${progress.daysUntilStart === 1 ? 'day' : 'days'}`;
    case 'done':
      return `Deadline reached · ${progress.total} days`;
    default:
      return `Day ${progress.elapsed} of ${progress.total} · ${progress.daysLeft} left`;
  }
}

export function PercentDisplay({ progress }: { progress: Progress }) {
  const theme = useTheme();
  const percent = formatPercent(progress.percent);

  return (
    <View style={styles.container} accessible accessibilityLabel={`${percent} percent expected. ${caption(progress)}`}>
      <ThemedText style={styles.number} numberOfLines={1} adjustsFontSizeToFit>
        {percent}
        <ThemedText style={styles.sign} themeColor="textSecondary">
          %
        </ThemedText>
      </ThemedText>
      <View style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
        <View
          style={[styles.fill, { backgroundColor: theme.accent, width: `${progress.percent}%` }]}
        />
      </View>
      <ThemedText themeColor="textSecondary">{caption(progress)}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: Spacing.three,
  },
  number: {
    fontSize: 112,
    lineHeight: 124,
    fontWeight: 700,
    fontVariant: ['tabular-nums'],
  },
  sign: {
    fontSize: 48,
    fontWeight: 600,
  },
  track: {
    alignSelf: 'stretch',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
