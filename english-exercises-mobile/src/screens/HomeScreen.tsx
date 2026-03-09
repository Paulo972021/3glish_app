import React from "react";
import { Pressable, Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { theme } from "../theme/theme";

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
  const cardBg = darkMode ? theme.colors.surface : theme.colors.lightSurface;
  const text = darkMode ? theme.colors.textPrimary : theme.colors.lightText;

  const PrimaryBtn = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: theme.border.normal,
        borderColor: theme.colors.neon,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.neon,
      }}
    >
      <Text
        style={{
          color: theme.colors.black,
          fontWeight: "900",
          fontSize: theme.typography.body,
          textTransform: "uppercase",
          letterSpacing: 1.5,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ gap: theme.spacing.sm, flex: 1 }}>
        <Text
          style={{
            fontSize: theme.typography.h1,
            fontWeight: "900",
            color: text,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          English Exercises MVP
        </Text>

        <View style={{ gap: theme.spacing.sm, backgroundColor: cardBg, padding: theme.spacing.sm, borderRadius: theme.radius.sm }}>
          <PrimaryBtn label="Continuar" onPress={onSolve} />
          <PrimaryBtn label="Importar pack" onPress={onImport} />
          <PrimaryBtn label="Estatísticas" onPress={onStats} />
          <PrimaryBtn label="Configurações" onPress={onSettings} />
        </View>

        <MenuButton onPress={onBackToMenu} darkMode={darkMode} />
      </View>
    </ScreenContainer>
  );
}
