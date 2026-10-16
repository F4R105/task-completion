import Storage from 'expo-sqlite/kv-store';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ProgressStyle = 'bar' | 'ring';

export type Settings = {
  theme: ThemePreference;
  progressStyle: ProgressStyle;
  /** Task ids left out of the copied report. */
  reportExcludedIds: string[];
};

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  progressStyle: 'bar',
  reportExcludedIds: [],
};

const SETTINGS_KEY = 'settings';

export function loadSettings(): Settings {
  try {
    const raw = Storage.getItemSync(SETTINGS_KEY);
    // Merge so settings added in later versions get their defaults.
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.warn('Could not load settings', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  Storage.setItemSync(SETTINGS_KEY, JSON.stringify(settings));
}
