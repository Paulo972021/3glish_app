import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { FillBlankSingleView } from "../components/views/FillBlankSingleView";
import { FreeTextView } from "../components/views/FreeTextView";
import { MultipleChoiceView } from "../components/views/MultipleChoiceView";
import { PronunciationAudioView } from "../components/views/PronunciationAudioView";
import { TrueFalseView } from "../components/views/TrueFalseView";
import { Modality, UiModel } from "../core/contracts/types";
import { gradeMatchAny } from "../core/grading/graders";
import { getNext, submitAttempt } from "../services/engine/solveEngine";
import { getDeckModalityProgress, getDeckStats } from "../services/db/statsRepo";
import { theme } from "../theme/theme";

const MODALITIES: Array<{ label: string; value: Modality }> = [
  { label: "Tradução", value: "translation" },
  { label: "Pronúncia", value: "pronunciation" },
  { label: "Completar frases", value: "fill_blank" },
  { label: "Tradução reversa", value: "reverse_translation" },
  { label: "Múltipla escolha", value: "multiple_choice" },
  { label: "Verdadeiro/Falso", value: "true_false" },
];

type SolveStage = "select_pack" | "deck_overview" | "exercise";

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
  const [stage, setStage] = useState<SolveStage>("select_pack");
  const [modality, setModality] = useState<Modality | null>(null);
  const [uiModel, setUiModel] = useState<UiModel | null>(null);
  const [retryQueue, setRetryQueue] = useState<UiModel[]>([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [deckStats, setDeckStats] = useState({ done_total: 0, correct_total: 0, wrong_total: 0 });
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const textColor = darkMode ? theme.colors.textPrimary : theme.colors.lightText;

  useEffect(() => {
    if (selectedPackId) {
      setStage("deck_overview");
      setModality(null);
      setUiModel(null);
      setRetryQueue([]);
      setAnswer("");
      setFeedback("");
      (async () => {
        const stats = await getDeckStats(selectedPackId);
        setDeckStats(stats);
      })().catch(() => undefined);
    }
  }, [selectedPackId]);

  async function loadNextForModality(packId: string, selectedModality: Modality) {
    const prog = await getDeckModalityProgress(packId, selectedModality);
    setProgress(prog);

    const fromRetry = retryQueue.length > 0 && Math.random() < 0.35;
    if (fromRetry) {
      const idx = Math.floor(Math.random() * retryQueue.length);
      const ex = retryQueue[idx];
      setRetryQueue((prev) => prev.filter((_, i) => i !== idx));
      setUiModel(ex);
      return;
    }

    const next = await getNext(packId, selectedModality);
    setUiModel(next);
  }

  const renderExerciseView = useMemo(() => {
    if (!uiModel) return <Text style={{ color: theme.colors.textSecondary }}>Sem exercícios pendentes para este módulo.</Text>;

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

  if (stage === "select_pack") {
    return (
      <ScreenContainer darkMode={darkMode}>
        <View style={{ flex: 1, gap: theme.spacing.sm }}>
          <Text style={{ color: textColor, fontSize: theme.typography.h2, fontWeight: "900" }}>Selecionar deck</Text>
          {availablePackIds.length === 0 ? (
            <Text style={{ color: theme.colors.error }}>Nenhum pack importado.</Text>
          ) : (
            availablePackIds.map((packId) => (
              <Pressable
                key={packId}
                onPress={() => onSelectPack(packId)}
                style={{ borderWidth: theme.border.normal, borderColor: theme.colors.neon, borderRadius: theme.radius.sm, padding: theme.spacing.sm }}
              >
                <Text style={{ color: theme.colors.neon, fontWeight: "800" }}>{packId}</Text>
              </Pressable>
            ))
          )}
          <MenuButton onPress={onBack} darkMode={darkMode} />
        </View>
      </ScreenContainer>
    );
  }

  if (stage === "deck_overview") {
    return (
      <ScreenContainer darkMode={darkMode}>
        <View style={{ flex: 1, gap: theme.spacing.sm }}>
          <Text style={{ color: textColor, fontSize: theme.typography.h2, fontWeight: "900" }}>Deck: {selectedPackId ?? "-"}</Text>
          <Text style={{ color: theme.colors.textSecondary }}>Feitos: {deckStats.done_total}</Text>
          <Text style={{ color: theme.colors.success }}>Certos: {deckStats.correct_total}</Text>
          <Text style={{ color: theme.colors.error }}>Errados: {deckStats.wrong_total}</Text>

          <Text style={{ color: textColor, fontWeight: "800", marginTop: 8 }}>Escolha o tipo de estudo</Text>
          <View style={{ gap: theme.spacing.xs }}>
            {MODALITIES.map((m) => (
              <Pressable
                key={m.value}
                onPress={async () => {
                  if (!selectedPackId) return;
                  setModality(m.value);
                  setStage("exercise");
                  setFeedback("");
                  setAnswer("");
                  await loadNextForModality(selectedPackId, m.value);
                }}
                style={{
                  borderWidth: theme.border.normal,
                  borderColor: theme.colors.neon,
                  borderRadius: theme.radius.sm,
                  padding: theme.spacing.sm,
                  backgroundColor: theme.colors.neon,
                }}
              >
                <Text style={{ color: theme.colors.black, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5 }}>{m.label}</Text>
              </Pressable>
            ))}
          </View>

          <MenuButton onPress={() => setStage("select_pack")} darkMode={darkMode} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ flex: 1, gap: theme.spacing.sm }}>
        <Text style={{ color: textColor, fontSize: theme.typography.h2, fontWeight: "900" }}>
          {MODALITIES.find((m) => m.value === modality)?.label ?? "Exercícios"}
        </Text>

        <Text>
          <Text style={{ color: theme.colors.success, fontWeight: "900" }}>{progress.done}</Text>
          <Text style={{ color: theme.colors.neon, fontWeight: "900" }}>/{progress.total}</Text>
        </Text>

        <View style={{ flex: 1 }}>{renderExerciseView}</View>

        {uiModel && (
          <>
            <TextInput
              placeholder="Digite sua resposta"
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
                if (!selectedPackId || !uiModel || !modality) return;

                const result = evaluate(uiModel, answer);
                await submitAttempt({
                  packId: selectedPackId,
                  ui: uiModel,
                  result,
                  userAnswer: answer,
                });

                if (result === "wrong") {
                  setRetryQueue((prev) => [...prev, uiModel]);
                }

                setFeedback(
                  result === "correct"
                    ? "✅ Resposta correta!"
                    : result === "wrong"
                    ? "❌ Resposta incorreta. Ela pode voltar mais adiante."
                    : "✅ Exercício marcado como concluído."
                );

                setAnswer("");
                await loadNextForModality(selectedPackId, modality);
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

        <MenuButton
          onPress={() => {
            setStage("deck_overview");
            setModality(null);
            setUiModel(null);
            setAnswer("");
            setFeedback("");
          }}
          darkMode={darkMode}
        />
      </View>
    </ScreenContainer>
  );
}
