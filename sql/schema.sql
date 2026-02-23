PRAGMA foreign_keys = ON;

-- Packs importados no dispositivo
CREATE TABLE IF NOT EXISTS packs (
  pack_id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL,
  date TEXT NOT NULL,
  run_id TEXT,
  weekly_word TEXT,
  language_pair TEXT,
  manifest_json TEXT NOT NULL,
  imported_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Catálogo de exercícios (somente leitura após import)
CREATE TABLE IF NOT EXISTS exercises (
  exercise_id TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL,
  modality TEXT NOT NULL CHECK (
    modality IN (
      'translation',
      'reverse_translation',
      'fill_blank',
      'multiple_choice',
      'true_false',
      'pronunciation'
    )
  ),
  date TEXT,
  language_pair TEXT,
  weekly_word TEXT,
  prompt TEXT,
  payload_json TEXT NOT NULL,
  ui_model_json TEXT NOT NULL,
  audio_file TEXT,
  has_audio INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (pack_id) REFERENCES packs(pack_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_exercises_pack_modality ON exercises(pack_id, modality);
CREATE INDEX IF NOT EXISTS idx_exercises_pack_date ON exercises(pack_id, date);

-- Tentativas/resoluções do usuário (append-only)
CREATE TABLE IF NOT EXISTS attempts (
  attempt_id TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  modality TEXT NOT NULL,
  ts TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('correct', 'wrong', 'done_no_grade')),
  user_answer_json TEXT,
  played_count INTEGER,
  speed REAL,
  self_rating INTEGER,
  FOREIGN KEY (pack_id) REFERENCES packs(pack_id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attempts_exercise ON attempts(exercise_id, ts);
CREATE INDEX IF NOT EXISTS idx_attempts_pack_ts ON attempts(pack_id, ts);
CREATE INDEX IF NOT EXISTS idx_attempts_modality ON attempts(modality, ts);

-- Configurações do app (key-value)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Velocidade padrão de reprodução
INSERT OR IGNORE INTO settings(key, value) VALUES ('audio_speed_default', '1.0');

-- Estatísticas globais por pack (último estado acumulado)
CREATE VIEW IF NOT EXISTS v_pack_stats AS
SELECT
  p.pack_id,
  COUNT(a.attempt_id) AS feitos_total,
  SUM(CASE WHEN a.result = 'correct' THEN 1 ELSE 0 END) AS certos_total,
  SUM(CASE WHEN a.result = 'wrong' THEN 1 ELSE 0 END) AS errados_total
FROM packs p
LEFT JOIN attempts a ON a.pack_id = p.pack_id
GROUP BY p.pack_id;

-- Estatísticas por modalidade
CREATE VIEW IF NOT EXISTS v_pack_stats_by_modality AS
SELECT
  p.pack_id,
  e.modality,
  COUNT(a.attempt_id) AS feitos,
  SUM(CASE WHEN a.result = 'correct' THEN 1 ELSE 0 END) AS certos,
  SUM(CASE WHEN a.result = 'wrong' THEN 1 ELSE 0 END) AS errados
FROM packs p
JOIN exercises e ON e.pack_id = p.pack_id
LEFT JOIN attempts a ON a.exercise_id = e.exercise_id
GROUP BY p.pack_id, e.modality;
