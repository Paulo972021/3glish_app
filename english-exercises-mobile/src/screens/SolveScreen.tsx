import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { FillBlankSingleView } from "../components/views/FillBlankSingleView";
import { FreeTextView } from "../components/views/FreeTextView";
import { MultipleChoiceView } from "../components/views/MultipleChoiceView";
import { PronunciationAudioView } from "../components/views/PronunciationAudioView";
import { TrueFalseView } from "../components/views/TrueFalseView";
import { UiModel } from "../core/contracts/types";
import { gradeMatchAny } from "../core/grading/graders";
import { getNext, submitAttempt } from "../services/engine/solveEngine";
import { theme } from "../theme/theme";

function evaluate(ui: UiModel, userAnswer: string): "correct" | "wrong" | "done_no_grade" {
  if (!ui.grading_spec?.gradable) return "done_no_grade";

  if (ui.grading_spec?.kind === "match_any_answer") {
    return gradeMatchAny(userAnswer, ui.grading_spec?.accepted_answers ?? []) ? "correct" : "wrong";
  }

  if (ui.grading_spec?.kind === "index_equals") {
    const selected = Number(userAnswer);
    return selected === ui.grading_spec?.correct_index ? "correct" : "wrong";
  }

  if (ui.grading_spec?.kind === "boolean_equals_label") {
    const normalized = userAnswer.trim().toLowerCase();
    const truthy = ["verdadeiro", "true", "v", "1"];
    const expectedTrue = (ui.grading_spec?.label_mapping?.true_values ?? truthy).map((v: string) => v.toLowerCase());
    const expectedFalse = (ui.grading_spec?.label_mapping?.false_values ?? ["falso", "false", "f", "0"]).map((v: string) =>
      v.toLowerCase()
    );
    const expectedLabel = String(ui.grading_spec?.label_source ?? "").trim().toLowerCase();
    const expected = expectedTrue.includes(expectedLabel) ? "true" : expectedFalse.includes(expectedLabel) ? "false" : "unknown";
    const given = truthy.includes(normalized) ? "true" : ["falso", "false", "f", "0"].includes(normalized) ? "false" : "unknown";
    return expected !== "unknown" && expected === given ? "correct" : "wrong";
  }

  return "wrong";
}

export function SolveScreen({
  onBack,
  darkMode = true,
  selectedPackId,
  availablePackIds,
  onSelectPack,
}: {
  onBack: () => void;
  darkMode?: boolean;
  selectedPackId: string | null;
  availablePackIds: string[];
  onSelectPack: (packId: string) => void;
}) {
  const [uiModel, setUiModel] = useState<UiModel | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string>("");

  const textColor = darkMode ? theme.colors.textPrimary : theme.colors.lightText;

  useEffect(() => {
    (async () => {
      if (!selectedPackId) {
        setUiModel(null);
        return;
      }
      const next = await getNext(selectedPackId);
      setUiModel(next);
      setAnswer("");
      setFeedback(next ? "" : "Não há mais exercícios pendentes neste pack.");
    })();
  }, [selectedPackId]);

  const renderView = useMemo(() => {
    if (!uiModel) return <View />;

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
  }, [uiModel, darkMode]);

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ flex: 1, gap: theme.spacing.sm }}>
        <Text style={{ color: textColor, fontSize: theme.typography.h2, fontWeight: "900" }}>RESOLVER EXERCÍCIOS</Text>

        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ color: textColor, fontWeight: "700" }}>Selecionar pack</Text>
          <View style={{ flexDirection: "row", gap: theme.spacing.xs, flexWrap: "wrap" }}>
            {availablePackIds.length === 0 ? (
              <Text style={{ color: theme.colors.error }}>Nenhum pack importado.</Text>
            ) : (
              availablePackIds.map((packId) => (
                <Pressable
                  key={packId}
                  onPress={() => onSelectPack(packId)}
                  style={{
                    borderWidth: theme.border.normal,
                    borderColor: theme.colors.neon,
                    borderRadius: theme.radius.sm,
                    padding: theme.spacing.xs,
                    backgroundColor: selectedPackId === packId ? theme.colors.neon : "transparent",
                  }}
                >
                  <Text style={{ color: selectedPackId === packId ? theme.colors.black : theme.colors.neon, fontWeight: "800" }}>{packId}</Text>
                </Pressable>
              ))
            )}
          </View>
        </View>

        <View style={{ flex: 1 }}>{renderView}</View>

        {uiModel && (
          <>
            <TextInput
              placeholder="Digite sua resposta (texto / índice / verdadeiro|falso)"
              placeholderTextColor={theme.colors.textSecondary}
              value={answer}
              onChangeText={setAnswer}
              style={{
                borderWidth: theme.border.normal,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.sm,
                padding: theme.spacing.sm,
                color: textColor,
              }}
            />

            <Pressable
              onPress={async () => {
                if (!selectedPackId || !uiModel) return;
                const result = evaluate(uiModel, answer);
                await submitAttempt({
                  packId: selectedPackId,
                  ui: uiModel,
                  result,
                  userAnswer: answer,
                });

                setFeedback(
                  result === "correct"
                    ? "✅ Resposta correta!"
                    : result === "wrong"
                    ? "❌ Resposta incorreta."
                    : "✅ Exercício marcado como concluído."
                );

                const next = await getNext(selectedPackId);
                setUiModel(next);
                setAnswer("");
                if (!next) {
                  setFeedback("✅ Pack concluído. Não há mais exercícios pendentes.");
                }
              }}
              style={{
                borderWidth: theme.border.normal,
                borderColor: theme.colors.neon,
                borderRadius: theme.radius.sm,
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.neon,
              }}
            >
              <Text style={{ color: theme.colors.black, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5 }}>Enviar resposta</Text>
            </Pressable>
          </>
        )}

        {feedback ? <Text style={{ color: textColor }}>{feedback}</Text> : null}

        <MenuButton onPress={onBack} darkMode={darkMode} />
      </View>
    </ScreenContainer>
  );
}
