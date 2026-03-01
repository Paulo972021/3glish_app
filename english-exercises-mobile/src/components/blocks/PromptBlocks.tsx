import React from "react";
import { Text, View } from "react-native";
import { PromptBlock } from "../../core/contracts/types";
import { theme } from "../../theme/theme";

export function PromptBlocks({ blocks, darkMode = true }: { blocks: PromptBlock[]; darkMode?: boolean }) {
  return (
    <View
      style={{
        gap: theme.spacing.xs,
        padding: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        borderWidth: theme.border.normal,
        borderColor: theme.colors.border,
        backgroundColor: darkMode ? theme.colors.surface : theme.colors.lightSurface,
      }}
    >
      {blocks.map((block, idx) => (
        <Text key={idx} style={{ color: darkMode ? theme.colors.textPrimary : theme.colors.lightText, fontSize: theme.typography.body }}>
          {block.value}
        </Text>
      ))}
    </View>
  );
}
