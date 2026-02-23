import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { pickAndImportPack } from "../services/storage/zipImport";

export function ImportPackScreen({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<string>("Aguardando importação...");

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Importar Pack</Text>
      <Pressable
        onPress={async () => {
          try {
            const result = await pickAndImportPack();
            setStatus(`Pack importado: ${result.packId}`);
          } catch (e) {
            setStatus(`Falha: ${String(e)}`);
          }
        }}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      >
        <Text>Selecionar .zip</Text>
      </Pressable>
      <Text>{status}</Text>
      <Pressable onPress={onBack} style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}>
        <Text>Voltar</Text>
      </Pressable>
    </View>
  );
}
