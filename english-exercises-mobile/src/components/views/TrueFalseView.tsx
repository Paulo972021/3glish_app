import React from "react";
import { Pressable, Text, View } from "react-native";
import { UiModel } from "../../core/contracts/types";
import { theme } from "../../theme/theme";
import { PromptBlocks } from "../blocks/PromptBlocks";

export function TrueFalseView({ ui, darkMode = true }: { ui: UiModel; darkMode?: boolean }) {
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <PromptBlocks blocks={ui.prompt_blocks} darkMode={darkMode} />
      <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
        <Pressable
          style={{
            borderWidth: theme.border.normal,
            borderColor: theme.colors.neon,
            borderRadius: theme.radius.sm,
            padding: theme.spacing.sm,
            flex: 1,
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ color: theme.colors.neon, textTransform: "uppercase", fontWeight: "900", letterSpacing: 1.5 }}>Verdadeiro</Text>
        </Pressable>
        <Pressable
          style={{
            borderWidth: theme.border.normal,
            borderColor: theme.colors.neon,
            borderRadius: theme.radius.sm,
            padding: theme.spacing.sm,
            flex: 1,
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ color: theme.colors.neon, textTransform: "uppercase", fontWeight: "900", letterSpacing: 1.5 }}>Falso</Text>
        </Pressable>
      </View>
    </View>
  );
}
