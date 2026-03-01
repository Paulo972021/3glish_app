import React from "react";
import { Pressable, Text } from "react-native";

export function MenuButton({ onPress, darkMode = false }: { onPress: () => void; darkMode?: boolean }) {
  const border = darkMode ? "#374151" : "#d1d5db";
  const bg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";

  return (
    <Pressable onPress={onPress} style={{ borderWidth: 1, borderColor: border, borderRadius: 8, padding: 10, backgroundColor: bg }}>
      <Text style={{ color: text }}>Voltar ao menu</Text>
    </Pressable>
  );
}
