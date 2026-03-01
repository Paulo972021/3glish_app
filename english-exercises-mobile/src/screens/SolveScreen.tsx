import React from "react";
import { View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { FillBlankSingleView } from "../components/views/FillBlankSingleView";
import { FreeTextView } from "../components/views/FreeTextView";
import { MultipleChoiceView } from "../components/views/MultipleChoiceView";
import { PronunciationAudioView } from "../components/views/PronunciationAudioView";
import { TrueFalseView } from "../components/views/TrueFalseView";
import { UiModel } from "../core/contracts/types";

export function SolveScreen({
  uiModel,
  onBack,
  darkMode = false,
}: {
  uiModel: UiModel;
  onBack: () => void;
  darkMode?: boolean;
}) {
  const renderView = () => {
    switch (uiModel.view_type) {
      case "free_text":
        return <FreeTextView ui={uiModel} />;
      case "fill_blank_single":
        return <FillBlankSingleView ui={uiModel} />;
      case "multiple_choice":
        return <MultipleChoiceView ui={uiModel} />;
      case "true_false":
        return <TrueFalseView ui={uiModel} />;
      case "pronunciation_audio":
        return <PronunciationAudioView ui={uiModel} />;
      default:
        return <View />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderView()}</View>
      <View style={{ padding: 16 }}>
        <MenuButton onPress={onBack} darkMode={darkMode} />
      </View>
    </View>
  );
}
