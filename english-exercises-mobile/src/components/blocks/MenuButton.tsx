import React from "react";
import { Pressable, Text } from "react-native";
import { theme } from "../../theme/theme";

export function MenuButton({ onPress, darkMode = true }: { onPress: () => void; darkMode?: boolean }) {
  const border = darkMode ? theme.colors.neon : theme.colors.bgPrimary;
  const text = darkMode ? theme.colors.neon : theme.colors.bgPrimary;

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: theme.border.normal,
        borderColor: border,
        borderRadius: theme.radius.sm,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: "transparent",
      }}
    >
      <Text
        style={{
          color: text,
          fontSize: theme.typography.body,
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: 1.5,
        }}
      >
        Voltar ao menu
      </Text>
    </Pressable>
  );
}
