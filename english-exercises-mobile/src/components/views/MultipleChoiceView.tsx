import React from "react";
import { Pressable, Text, View } from "react-native";
import { UiModel } from "../../core/contracts/types";
import { theme } from "../../theme/theme";
import { PromptBlocks } from "../blocks/PromptBlocks";

export function MultipleChoiceView({ ui, darkMode = true }: { ui: UiModel; darkMode?: boolean }) {
  const options: string[] = ui.input_spec?.options ?? [];

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <PromptBlocks blocks={ui.prompt_blocks} darkMode={darkMode} />
      {options.map((opt, idx) => (
        <Pressable
          key={idx}
          style={{
            borderWidth: theme.border.normal,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.sm,
            padding: theme.spacing.sm,
            backgroundColor: darkMode ? theme.colors.surface : theme.colors.lightSurface,
          }}
        >
          <Text style={{ color: darkMode ? theme.colors.textPrimary : theme.colors.lightText }}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}
