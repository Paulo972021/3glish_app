import { Modality, UiModel } from "../../core/contracts/types";
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

/**
 * Pega o próximo exercício ainda não respondido.
 * Se `modality` for passado, filtra por módulo.
 */
export async function getNextUiModel(packId: string, modality?: Modality): Promise<UiModel | null> {
  const db = await getDb();

  const whereMod = modality ? "AND e.modality = ?" : "";
  const args: (string | Modality)[] = modality ? [packId, modality] : [packId];

  const row = await db.getFirstAsync<{ ui_model_json: string }>(
    `
    SELECT e.ui_model_json
    FROM exercises e
    LEFT JOIN attempts a
      ON a.pack_id = e.pack_id AND a.exercise_id = e.exercise_id
    WHERE e.pack_id = ?
      ${whereMod}
      AND a.exercise_id IS NULL
    ORDER BY e.rowid
    LIMIT 1
    `,
    args
  );

  if (!row) return null;
  return JSON.parse(row.ui_model_json) as UiModel;
}
