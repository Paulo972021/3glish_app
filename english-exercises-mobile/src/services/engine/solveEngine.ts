import { Attempt, AttemptResult, Modality, UiModel } from "../../core/contracts/types";
import { insertAttempt } from "../db/attemptsRepo";
import { getNextUiModel } from "../db/exercisesRepo";

function uuid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function submitAttempt(params: {
  packId: string;
  ui: UiModel;
  result: AttemptResult;
  userAnswer?: string | null;
  pronunciationMetrics?: Attempt["pronunciation_metrics"] | null;
}) {
  const attempt: Attempt = {
    attempt_id: uuid(),
    pack_id: params.packId,
    exercise_id: params.ui.exercise_id,
    modality: params.ui.modality,
    ts: new Date().toISOString(),
    result: params.result,
    user_answer: params.userAnswer ?? null,
    pronunciation_metrics: params.pronunciationMetrics ?? null,
  };

  await insertAttempt(attempt);
}

export async function getNext(packId: string, modality?: Modality) {
  return getNextUiModel(packId, modality);
}
