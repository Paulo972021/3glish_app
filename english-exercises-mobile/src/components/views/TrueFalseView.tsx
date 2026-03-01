import React from "react";
import { Pressable, Text, View } from "react-native";
import { UiModel } from "../../core/contracts/types";
import { PromptBlocks } from "../blocks/PromptBlocks";

export function TrueFalseView({ ui }: { ui: UiModel }) {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <PromptBlocks blocks={ui.prompt_blocks} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, flex: 1 }}>
          <Text>Verdadeiro</Text>
        </Pressable>
        <Pressable style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, flex: 1 }}>
          <Text>Falso</Text>
        </Pressable>
      </View>
    </View>
  );
}
