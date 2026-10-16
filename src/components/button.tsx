import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ title, variant = 'primary', disabled, style, ...rest }: ButtonProps) {
  const theme = useTheme();
  const filled = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        styles.button,
        { backgroundColor: filled ? theme.accent : theme.backgroundElement },
        (disabled || state.pressed) && { opacity: disabled ? 0.4 : 0.7 },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <ThemedText
        type="smallBold"
        style={[styles.label, { color: filled ? '#ffffff' : theme[variant === 'danger' ? 'danger' : 'text'] }]}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
});
