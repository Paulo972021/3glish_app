import React from "react";
import { TextInput, View } from "react-native";
import { UiModel } from "../../core/contracts/types";
import { theme } from "../../theme/theme";
import { PromptBlocks } from "../blocks/PromptBlocks";

export function FreeTextView({ ui, darkMode = true }: { ui: UiModel; darkMode?: boolean }) {
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <PromptBlocks blocks={ui.prompt_blocks} darkMode={darkMode} />
      <TextInput
        placeholder={ui.input_spec?.placeholder ?? "Digite..."}
        placeholderTextColor={theme.colors.textSecondary}
        style={{
          borderWidth: theme.border.normal,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.sm,
          padding: theme.spacing.sm,
          backgroundColor: darkMode ? theme.colors.bgPrimary : theme.colors.lightSurface,
          color: darkMode ? theme.colors.textPrimary : theme.colors.lightText,
          fontSize: theme.typography.body,
        }}
      />
    </View>
  );
}
