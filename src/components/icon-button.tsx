import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type IconButtonProps = {
  icon: SymbolViewProps['name'];
  /** Read by screen readers, and shown if the icon cannot be rendered. */
  label: string;
  onPress: () => void;
  /** Diameter of the circle. */
  size?: number;
  backgroundColor: string;
  tintColor: string;
  style?: StyleProp<ViewStyle>;
};

/** A circular button with a centered symbol. */
export function IconButton({
  icon,
  label,
  onPress,
  size = 44,
  backgroundColor,
  tintColor,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={Spacing.two}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}>
      <SymbolView
        name={icon}
        size={Math.round(size * 0.5)}
        tintColor={tintColor}
        fallback={<ThemedText style={{ color: tintColor }}>{label}</ThemedText>}
      />
    </Pressable>
  );
}
