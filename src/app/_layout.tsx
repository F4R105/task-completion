import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { TasksProvider } from '@/hooks/use-tasks';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TasksProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="task/new" options={{ presentation: 'modal', title: 'New task' }} />
          <Stack.Screen name="task/[id]" options={{ presentation: 'modal', title: 'Edit task' }} />
        </Stack>
      </TasksProvider>
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}
