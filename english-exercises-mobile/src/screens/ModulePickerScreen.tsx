import React from "react";
import { Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";

export function ModulePickerScreen({ onBack, darkMode = false }: { onBack: () => void; darkMode?: boolean }) {
  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      <Text>Escolher módulo (TODO)</Text>
      <MenuButton onPress={onBack} darkMode={darkMode} />
    </View>
  );
}
