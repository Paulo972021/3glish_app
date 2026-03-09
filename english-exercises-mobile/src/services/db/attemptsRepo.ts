import { Attempt } from "../../core/contracts/types";
import { getDb } from "./db";

export async function insertAttempt(attempt: Attempt): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO attempts
      (attempt_id, pack_id, exercise_id, modality, ts, result, user_answer, pronunciation_metrics_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      attempt.attempt_id,
      attempt.pack_id,
      attempt.exercise_id,
      attempt.modality,
      attempt.ts,
      attempt.result,
      attempt.user_answer ?? null,
      attempt.pronunciation_metrics ? JSON.stringify(attempt.pronunciation_metrics) : null,
    ]
  );
}
