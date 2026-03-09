import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@english_exercises_settings";

type SettingsState = {
  audioSpeedDefault: number;
  darkModeEnabled: boolean;
};

let state: SettingsState = {
  audioSpeedDefault: 1.0,
  darkModeEnabled: false,
};

async function persistSettings(): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
}

export async function loadSettings(): Promise<void> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    state = {
      audioSpeedDefault:
        typeof parsed.audioSpeedDefault === "number" ? Math.min(1.5, Math.max(0.75, parsed.audioSpeedDefault)) : 1.0,
      darkModeEnabled: Boolean(parsed.darkModeEnabled),
    };
  } catch {
    state = {
      audioSpeedDefault: 1.0,
      darkModeEnabled: false,
    };
  }
}

export function getAudioSpeedDefault(): number {
  return state.audioSpeedDefault;
}

export async function setAudioSpeedDefault(value: number): Promise<void> {
  state.audioSpeedDefault = Math.min(1.5, Math.max(0.75, value));
  await persistSettings();
}

export function getDarkModeEnabled(): boolean {
  return state.darkModeEnabled;
}

export async function setDarkModeEnabled(value: boolean): Promise<void> {
  state.darkModeEnabled = value;
  await persistSettings();
}
