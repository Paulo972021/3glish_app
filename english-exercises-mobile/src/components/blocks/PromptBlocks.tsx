import React from "react";
import { Text, View } from "react-native";
import { PromptBlock } from "../../core/contracts/types";

export function PromptBlocks({ blocks }: { blocks: PromptBlock[] }) {
  return (
    <View style={{ gap: 8 }}>
      {blocks.map((block, idx) => (
        <Text key={idx}>{block.value}</Text>
      ))}
    </View>
  );
}
