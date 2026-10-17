import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SettingsProvider } from '@/hooks/use-settings';
import { TasksProvider } from '@/hooks/use-tasks';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SettingsProvider>
      <TasksProvider>
        <ThemedStack />
      </TasksProvider>
    </SettingsProvider>
  );
}

function ThemedStack() {
  // Follows the theme chosen in Settings, which overrides the system scheme.
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="task/new" options={{ presentation: 'modal', title: 'New task' }} />
        <Stack.Screen name="task/[id]" options={{ presentation: 'modal', title: 'Edit task' }} />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: [0.75, 1],
            sheetGrabberVisible: true,
            sheetCornerRadius: 24,
          }}
        />
      </Stack>
      {/* Edge-to-edge makes the status bar transparent, so icons must contrast with the app theme. */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}
