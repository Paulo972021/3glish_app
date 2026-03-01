let audioSpeedDefault = 1.0;
let darkModeEnabled = false;

export function getAudioSpeedDefault(): number {
  return audioSpeedDefault;
}

export function setAudioSpeedDefault(value: number): void {
  audioSpeedDefault = Math.min(1.5, Math.max(0.75, value));
}

export function getDarkModeEnabled(): boolean {
  return darkModeEnabled;
}

export function setDarkModeEnabled(value: boolean): void {
  darkModeEnabled = value;
}
