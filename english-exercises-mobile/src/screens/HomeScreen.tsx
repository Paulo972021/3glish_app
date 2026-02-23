import React from "react";
import { Pressable, Text, View } from "react-native";

export function HomeScreen({
  onImport,
  onSolve,
  onStats,
  onSettings,
}: {
  onImport: () => void;
  onSolve: () => void;
  onStats: () => void;
  onSettings: () => void;
}) {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>English Exercises MVP</Text>
      <Pressable onPress={onSolve} style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
        <Text>Continuar</Text>
      </Pressable>
      <Pressable onPress={onImport} style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
        <Text>Importar pack</Text>
      </Pressable>
      <Pressable onPress={onStats} style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
        <Text>Estatísticas</Text>
      </Pressable>
      <Pressable onPress={onSettings} style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
        <Text>Configurações</Text>
      </Pressable>
    </View>
  );
}
