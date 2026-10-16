import { createContext, use, useEffect, useState, type ReactNode } from 'react';
import { Appearance } from 'react-native';

import { loadSettings, saveSettings, type Settings } from '@/lib/settings';

type SettingsContextValue = Settings & {
  updateSettings: (changes: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings);

  // Overriding the app's color scheme also re-themes native views such as date pickers.
  useEffect(() => {
    Appearance.setColorScheme(settings.theme === 'system' ? 'unspecified' : settings.theme);
  }, [settings.theme]);

  function updateSettings(changes: Partial<Settings>) {
    const next = { ...settings, ...changes };
    setSettings(next);
    saveSettings(next);
  }

  return <SettingsContext value={{ ...settings, updateSettings }}>{children}</SettingsContext>;
}

export function useSettings() {
  const value = use(SettingsContext);
  if (!value) {
    throw new Error('useSettings must be used inside <SettingsProvider>');
  }
  return value;
}
