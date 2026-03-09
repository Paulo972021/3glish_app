import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { UiModel } from "../../core/contracts/types";
import { AudioPlayer } from "../../services/audio/audioPlayer";
import { resolvePackFileUri } from "../../services/storage/paths";
import { theme } from "../../theme/theme";
import { PromptBlocks } from "../blocks/PromptBlocks";

export function PronunciationAudioView({ ui, darkMode = true }: { ui: UiModel; darkMode?: boolean }) {
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
    <View style={{ gap: theme.spacing.sm }}>
      <PromptBlocks blocks={ui.prompt_blocks} darkMode={darkMode} />

      <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.caption, fontWeight: "700" }}>
        VELOCIDADE: {speed.toFixed(2)}x
      </Text>

      <View style={{ flexDirection: "row", gap: theme.spacing.xs, flexWrap: "wrap" }}>
        {[0.75, 1.0, 1.25, 1.5].map((s) => (
          <Pressable
            key={s}
            onPress={() => setSpeed(s)}
            style={{
              borderWidth: theme.border.normal,
              borderColor: theme.colors.neon,
              borderRadius: theme.radius.sm,
              padding: theme.spacing.xs,
              backgroundColor: speed === s ? theme.colors.neon : "transparent",
            }}
          >
            <Text style={{ color: speed === s ? theme.colors.black : theme.colors.neon, fontWeight: "800" }}>{s}x</Text>
          </Pressable>
        ))}
      </View>

      {!audioUri ? (
        <Text style={{ color: theme.colors.error }}>Áudio indisponível.</Text>
      ) : (
        <View style={{ flexDirection: "row", gap: theme.spacing.xs, flexWrap: "wrap" }}>
          <Pressable
            onPress={async () => {
              await player.load(audioUri);
              await player.play(speed);
            }}
            style={{ borderWidth: theme.border.normal, borderColor: theme.colors.neon, borderRadius: theme.radius.sm, padding: theme.spacing.xs, backgroundColor: theme.colors.neon }}
          >
            <Text style={{ color: theme.colors.black, fontWeight: "900" }}>PLAY</Text>
          </Pressable>

          <Pressable
            onPress={() => player.pause()}
            style={{ borderWidth: theme.border.normal, borderColor: theme.colors.neon, borderRadius: theme.radius.sm, padding: theme.spacing.xs }}
          >
            <Text style={{ color: theme.colors.neon, fontWeight: "900" }}>PAUSE</Text>
          </Pressable>

          <Pressable
            onPress={() => player.replay(speed)}
            style={{ borderWidth: theme.border.normal, borderColor: theme.colors.neon, borderRadius: theme.radius.sm, padding: theme.spacing.xs }}
          >
            <Text style={{ color: theme.colors.neon, fontWeight: "900" }}>REPLAY</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
