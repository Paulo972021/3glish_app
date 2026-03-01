import React from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";

export function HomeScreen({
  onImport,
  onSolve,
  onStats,
  onSettings,
  onBackToMenu,
  darkMode,
}: {
  onImport: () => void;
  onSolve: () => void;
  onStats: () => void;
  onSettings: () => void;
  onBackToMenu: () => void;
  darkMode: boolean;
}) {
  const bg = darkMode ? "#111827" : "#ffffff";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";
  const border = darkMode ? "#374151" : "#d1d5db";
  const topInset = (StatusBar.currentHeight ?? 0) + 12;

  return (
    <View style={{ padding: 16, paddingTop: topInset, gap: 12, flex: 1, backgroundColor: bg }}>
      <Text style={{ fontSize: 22, fontWeight: "600", color: text }}>English Exercises MVP</Text>
      <Pressable onPress={onSolve} style={{ borderWidth: 1, borderColor: border, borderRadius: 8, padding: 12, backgroundColor: cardBg }}>
        <Text style={{ color: text }}>Continuar</Text>
      </Pressable>
      <Pressable onPress={onImport} style={{ borderWidth: 1, borderColor: border, borderRadius: 8, padding: 12, backgroundColor: cardBg }}>
        <Text style={{ color: text }}>Importar pack</Text>
      </Pressable>
      <Pressable onPress={onStats} style={{ borderWidth: 1, borderColor: border, borderRadius: 8, padding: 12, backgroundColor: cardBg }}>
        <Text style={{ color: text }}>Estatísticas</Text>
      </Pressable>
      <Pressable onPress={onSettings} style={{ borderWidth: 1, borderColor: border, borderRadius: 8, padding: 12, backgroundColor: cardBg }}>
        <Text style={{ color: text }}>Configurações</Text>
      </Pressable>
      <MenuButton onPress={onBackToMenu} darkMode={darkMode} />
    </View>
  );
}
