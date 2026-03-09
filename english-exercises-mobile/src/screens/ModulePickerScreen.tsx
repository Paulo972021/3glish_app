import React from "react";
import { Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { theme } from "../theme/theme";

export function ModulePickerScreen({ onBack, darkMode = true }: { onBack: () => void; darkMode?: boolean }) {
  const text = darkMode ? theme.colors.textPrimary : theme.colors.lightText;

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ gap: theme.spacing.sm, flex: 1 }}>
        <Text style={{ color: text }}>Escolher módulo (TODO)</Text>
        <MenuButton onPress={onBack} darkMode={darkMode} />
      </View>
    </ScreenContainer>
  );
}
