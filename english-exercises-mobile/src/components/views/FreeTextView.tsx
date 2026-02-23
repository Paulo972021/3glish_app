import React from "react";
import { TextInput, View } from "react-native";
import { UiModel } from "../../core/contracts/types";
import { PromptBlocks } from "../blocks/PromptBlocks";

export function FreeTextView({ ui }: { ui: UiModel }) {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <PromptBlocks blocks={ui.prompt_blocks} />
      <TextInput
        placeholder={ui.input_spec?.placeholder ?? "Digite..."}
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 }}
      />
    </View>
  );
}
