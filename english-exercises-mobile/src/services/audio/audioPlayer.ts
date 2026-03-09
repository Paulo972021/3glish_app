import { Audio } from "expo-av";

export class AudioPlayer {
  private sound: Audio.Sound | null = null;

  async load(uri: string) {
    await this.unload();
    const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: false });
    this.sound = sound;
  }

  async play(rate: number) {
    if (!this.sound) return;
    await this.sound.setRateAsync(rate, true);
    await this.sound.playAsync();
  }

  async pause() {
    if (!this.sound) return;
    await this.sound.pauseAsync();
  }

  async replay(rate: number) {
    if (!this.sound) return;
    await this.sound.setRateAsync(rate, true);
    await this.sound.replayAsync();
  }

  async unload() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}
