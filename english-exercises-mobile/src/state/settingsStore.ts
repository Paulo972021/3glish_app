let audioSpeedDefault = 1.0;

export function getAudioSpeedDefault(): number {
  return audioSpeedDefault;
}

export function setAudioSpeedDefault(value: number): void {
  audioSpeedDefault = Math.min(1.5, Math.max(0.75, value));
}
