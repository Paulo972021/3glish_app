export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS packs (
  pack_id TEXT PRIMARY KEY,
  manifest_json TEXT NOT NULL,
  imported_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises (
  exercise_id TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL,
  modality TEXT NOT NULL,
  has_audio INTEGER NOT NULL DEFAULT 0,
  audio_file TEXT,
  payload_json TEXT NOT NULL,
  ui_model_json TEXT NOT NULL,
  FOREIGN KEY(pack_id) REFERENCES packs(pack_id)
);

CREATE TABLE IF NOT EXISTS attempts (
  attempt_id TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  modality TEXT NOT NULL,
  ts TEXT NOT NULL,
  result TEXT NOT NULL,
  user_answer TEXT,
  pronunciation_metrics_json TEXT,
  FOREIGN KEY(pack_id) REFERENCES packs(pack_id),
  FOREIGN KEY(exercise_id) REFERENCES exercises(exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_exercises_pack_mod ON exercises(pack_id, modality);
CREATE INDEX IF NOT EXISTS idx_attempts_pack_ts ON attempts(pack_id, ts);
`;
