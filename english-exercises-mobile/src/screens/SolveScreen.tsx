import React from "react";
import { View } from "react-native";
import { UiModel } from "../core/contracts/types";
import { FillBlankSingleView } from "../components/views/FillBlankSingleView";
import { FreeTextView } from "../components/views/FreeTextView";
import { MultipleChoiceView } from "../components/views/MultipleChoiceView";
import { PronunciationAudioView } from "../components/views/PronunciationAudioView";
import { TrueFalseView } from "../components/views/TrueFalseView";

export function SolveScreen({ uiModel }: { uiModel: UiModel }) {
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
}
