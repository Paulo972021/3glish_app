import { UiModel } from "../../core/contracts/types";
import { getDb } from "./db";

export async function upsertExercise(params: {
  exerciseId: string;
  packId: string;
  modality: string;
  audioFile: string | null;
  payloadJson: string;
  uiModel: UiModel;
}) {
  const db = await getDb();
  const hasAudio = params.audioFile ? 1 : 0;

  await db.runAsync(
    `INSERT OR REPLACE INTO exercises
      (exercise_id, pack_id, modality, has_audio, audio_file, payload_json, ui_model_json)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      params.exerciseId,
      params.packId,
      params.modality,
      hasAudio,
      params.audioFile,
      params.payloadJson,
      JSON.stringify(params.uiModel),
    ]
  );
}

export async function getNextUiModel(packId: string): Promise<UiModel | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ ui_model_json: string }>(
    `SELECT ui_model_json FROM exercises WHERE pack_id = ? ORDER BY rowid LIMIT 1`,
    [packId]
  );

  if (!row) return null;
  return JSON.parse(row.ui_model_json) as UiModel;
}
