import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { UiModel } from "../../core/contracts/types";
import { AudioPlayer } from "../../services/audio/audioPlayer";
import { resolvePackFileUri } from "../../services/storage/paths";
import { PromptBlocks } from "../blocks/PromptBlocks";

export function PronunciationAudioView({ ui }: { ui: UiModel }) {
  const [speed, setSpeed] = useState(ui.audio_spec?.controls?.default_speed ?? 1.0);
  const player = useMemo(() => new AudioPlayer(), []);
  const audioRelPath = ui.audio_spec?.path ?? null;
  const audioUri = audioRelPath ? resolvePackFileUri(ui.pack_id, audioRelPath) : null;

  useEffect(() => {
    return () => {
      player.unload();
    };
  }, [player]);

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <PromptBlocks blocks={ui.prompt_blocks} />

      <Text>Velocidade: {speed.toFixed(2)}x</Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {[0.75, 1.0, 1.25, 1.5].map((s) => (
          <Pressable
            key={s}
            onPress={() => setSpeed(s)}
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8 }}
          >
            <Text>{s}x</Text>
          </Pressable>
        ))}
      </View>

      {!audioUri ? (
        <Text>Áudio indisponível.</Text>
      ) : (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={async () => {
              await player.load(audioUri);
              await player.play(speed);
            }}
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8 }}
          >
            <Text>Play</Text>
          </Pressable>

          <Pressable
            onPress={() => player.pause()}
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8 }}
          >
            <Text>Pause</Text>
          </Pressable>

          <Pressable
            onPress={() => player.replay(speed)}
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8 }}
          >
            <Text>Replay</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
