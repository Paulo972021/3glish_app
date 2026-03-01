import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import {
  getAudioSpeedDefault,
  setAudioSpeedDefault,
  setDarkModeEnabled,
} from "../state/settingsStore";

export function SettingsScreen({
  darkMode,
  onToggleDarkMode,
  onBack,
}: {
  darkMode: boolean;
  onToggleDarkMode: (enabled: boolean) => void;
  onBack: () => void;
}) {
  const [speed, setSpeed] = useState(getAudioSpeedDefault());
  const bg = darkMode ? "#111827" : "#ffffff";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";
  const border = darkMode ? "#374151" : "#d1d5db";

  return (
    <View style={{ padding: 16, gap: 12, flex: 1, backgroundColor: bg }}>
      <Text style={{ color: text }}>Velocidade padrão do áudio: {speed.toFixed(2)}x</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[0.75, 1.0, 1.25, 1.5].map((s) => (
          <Pressable
            key={s}
            onPress={() => {
              setAudioSpeedDefault(s);
              setSpeed(s);
            }}
            style={{ borderWidth: 1, borderColor: border, borderRadius: 8, padding: 8, backgroundColor: cardBg }}
          >
            <Text style={{ color: text }}>{s}x</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => {
          const next = !darkMode;
          setDarkModeEnabled(next);
          onToggleDarkMode(next);
        }}
        style={{ borderWidth: 1, borderColor: border, borderRadius: 8, padding: 12, backgroundColor: cardBg }}
      >
        <Text style={{ color: text }}>{darkMode ? "Desativar modo escuro" : "Ativar modo escuro"}</Text>
      </Pressable>

      <MenuButton onPress={onBack} darkMode={darkMode} />
    </View>
  );
}
