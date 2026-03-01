import React from "react";
import { View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { FillBlankSingleView } from "../components/views/FillBlankSingleView";
import { FreeTextView } from "../components/views/FreeTextView";
import { MultipleChoiceView } from "../components/views/MultipleChoiceView";
import { PronunciationAudioView } from "../components/views/PronunciationAudioView";
import { TrueFalseView } from "../components/views/TrueFalseView";
import { UiModel } from "../core/contracts/types";
import { theme } from "../theme/theme";

export function SolveScreen({
  uiModel,
  onBack,
  darkMode = true,
}: {
  uiModel: UiModel;
  onBack: () => void;
  darkMode?: boolean;
}) {
  const renderView = () => {
    switch (uiModel.view_type) {
      case "free_text":
        return <FreeTextView ui={uiModel} darkMode={darkMode} />;
      case "fill_blank_single":
        return <FillBlankSingleView ui={uiModel} darkMode={darkMode} />;
      case "multiple_choice":
        return <MultipleChoiceView ui={uiModel} darkMode={darkMode} />;
      case "true_false":
        return <TrueFalseView ui={uiModel} darkMode={darkMode} />;
      case "pronunciation_audio":
        return <PronunciationAudioView ui={uiModel} darkMode={darkMode} />;
      default:
        return <View />;
    }
  };

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ flex: 1, gap: theme.spacing.sm }}>
        <View style={{ flex: 1 }}>{renderView()}</View>
        <MenuButton onPress={onBack} darkMode={darkMode} />
      </View>
    </ScreenContainer>
  );
}
