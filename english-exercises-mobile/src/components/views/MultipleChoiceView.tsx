import React from "react";
import { Pressable, Text, View } from "react-native";
import { UiModel } from "../../core/contracts/types";
import { PromptBlocks } from "../blocks/PromptBlocks";

export function MultipleChoiceView({ ui }: { ui: UiModel }) {
  const options: string[] = ui.input_spec?.options ?? [];

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <PromptBlocks blocks={ui.prompt_blocks} />
      {options.map((opt, idx) => (
        <Pressable key={idx} style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12 }}>
          <Text>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}
