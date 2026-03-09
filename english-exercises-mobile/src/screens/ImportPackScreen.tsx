import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { pickAndImportPack } from "../services/storage/zipImport";
import { theme } from "../theme/theme";

export function ImportPackScreen({
  onBack,
  onPackImported,
  darkMode = true,
}: {
  onBack: () => void;
  onPackImported: (packId: string) => void;
  darkMode?: boolean;
}) {
  const [status, setStatus] = useState<string>("Aguardando importação...");
  const [loading, setLoading] = useState(false);
  const text = darkMode ? theme.colors.textPrimary : theme.colors.lightText;

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ gap: theme.spacing.sm, flex: 1 }}>
        <Text style={{ fontSize: theme.typography.h2, color: text, fontWeight: "800" }}>IMPORTAR PACK</Text>
        <Pressable
          onPress={async () => {
            try {
              setLoading(true);
              setStatus("Iniciando validação...");
              const result = await pickAndImportPack((message) => setStatus(message));
              onPackImported(result.packId);
              setStatus(`Pack ${result.packId} importado (${result.exercisesImported} exercícios).`);
            } catch (e) {
              setStatus(`Falha: ${String(e)}`);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          style={{
            borderWidth: theme.border.normal,
            borderColor: theme.colors.neon,
            borderRadius: theme.radius.sm,
            padding: theme.spacing.sm,
            backgroundColor: loading ? theme.colors.textSecondary : theme.colors.neon,
          }}
        >
          <Text style={{ color: theme.colors.black, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5 }}>
            {loading ? "Importando..." : "Selecionar .zip"}
          </Text>
        </Pressable>
        <Text style={{ color: darkMode ? theme.colors.textSecondary : theme.colors.lightText }}>{status}</Text>
        <MenuButton onPress={onBack} darkMode={darkMode} />
      </View>
    </ScreenContainer>
  );
}
