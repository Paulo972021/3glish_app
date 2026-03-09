import { Modality } from "../../core/contracts/types";
import { getDb } from "./db";

export type StatsPeriod = "today" | "7d" | "30d" | "all";

function periodWhere(period: StatsPeriod): { clause: string; args: string[] } {
  if (period === "all") return { clause: "", args: [] };
  if (period === "today") return { clause: "AND ts >= datetime('now', 'start of day')", args: [] };
  if (period === "7d") return { clause: "AND ts >= datetime('now', '-7 day')", args: [] };
  return { clause: "AND ts >= datetime('now', '-30 day')", args: [] };
}

export async function getGlobalStats(packId: string): Promise<{
  done_total: number;
  correct_total: number;
  wrong_total: number;
}> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    done_total: number;
    correct_total: number;
    wrong_total: number;
  }>(
    `SELECT
      COUNT(*) AS done_total,
      SUM(CASE WHEN result = 'correct' THEN 1 ELSE 0 END) AS correct_total,
      SUM(CASE WHEN result = 'wrong' THEN 1 ELSE 0 END) AS wrong_total
     FROM attempts
     WHERE pack_id = ?`,
    [packId]
  );

  return {
    done_total: row?.done_total ?? 0,
    correct_total: row?.correct_total ?? 0,
    wrong_total: row?.wrong_total ?? 0,
  };
}

export async function getGlobalStatsByPeriod(period: StatsPeriod): Promise<{
  done_total: number;
  correct_total: number;
  wrong_total: number;
  avg_done_per_day: number;
  avg_correct_per_day: number;
  avg_wrong_per_day: number;
}> {
  const db = await getDb();
  const { clause } = periodWhere(period);

  const totals = await db.getFirstAsync<{
    done_total: number;
    correct_total: number;
    wrong_total: number;
    active_days: number;
  }>(
    `SELECT
      COUNT(*) AS done_total,
      SUM(CASE WHEN result = 'correct' THEN 1 ELSE 0 END) AS correct_total,
      SUM(CASE WHEN result = 'wrong' THEN 1 ELSE 0 END) AS wrong_total,
      COUNT(DISTINCT substr(ts, 1, 10)) AS active_days
     FROM attempts
     WHERE 1 = 1 ${clause}`
  );

  const done = totals?.done_total ?? 0;
  const correct = totals?.correct_total ?? 0;
  const wrong = totals?.wrong_total ?? 0;
  const days = Math.max(1, totals?.active_days ?? 0);

  return {
    done_total: done,
    correct_total: correct,
    wrong_total: wrong,
    avg_done_per_day: Number((done / days).toFixed(2)),
    avg_correct_per_day: Number((correct / days).toFixed(2)),
    avg_wrong_per_day: Number((wrong / days).toFixed(2)),
  };
}

export async function getStatsByModality(period: StatsPeriod): Promise<Array<{
  modality: Modality;
  done: number;
  correct: number;
  wrong: number;
}>> {
  const db = await getDb();
  const { clause } = periodWhere(period);
  const rows = await db.getAllAsync<{
    modality: Modality;
    done: number;
    correct: number;
    wrong: number;
  }>(
    `SELECT
      modality,
      COUNT(*) AS done,
      SUM(CASE WHEN result = 'correct' THEN 1 ELSE 0 END) AS correct,
      SUM(CASE WHEN result = 'wrong' THEN 1 ELSE 0 END) AS wrong
     FROM attempts
     WHERE 1 = 1 ${clause}
     GROUP BY modality
     ORDER BY done DESC`
  );

  return rows;
}

export async function getMostErrorWords(period: StatsPeriod, limit = 8): Promise<Array<{ word: string; errors: number }>> {
  const db = await getDb();
  const { clause } = periodWhere(period);

  const rows = await db.getAllAsync<{
    payload_json: string;
  }>(
    `SELECT e.payload_json
     FROM attempts a
     JOIN exercises e ON e.exercise_id = a.exercise_id
     WHERE a.result = 'wrong' ${clause}`
  );

  const counts = new Map<string, number>();

  for (const row of rows) {
    try {
      const payload = JSON.parse(row.payload_json);
      const answers = Array.isArray(payload.answers) ? payload.answers : [];
      for (const ans of answers) {
        const txt = String(ans?.text ?? "").toLowerCase();
        for (const token of txt.split(/[^a-zA-ZÀ-ÿ]+/).filter(Boolean)) {
          counts.set(token, (counts.get(token) ?? 0) + 1);
        }
      }
    } catch {
      // ignore malformed payload
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, errors]) => ({ word, errors }));
}

export async function getDeckStats(packId: string): Promise<{
  done_total: number;
  correct_total: number;
  wrong_total: number;
}> {
  return getGlobalStats(packId);
}

export async function getDeckModalityProgress(packId: string, modality: Modality): Promise<{ done: number; total: number }> {
  const db = await getDb();

  const totalRow = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total FROM exercises WHERE pack_id = ? AND modality = ?`,
    [packId, modality]
  );

  const doneRow = await db.getFirstAsync<{ done: number }>(
    `SELECT COUNT(*) AS done
     FROM attempts
     WHERE pack_id = ? AND modality = ?`,
    [packId, modality]
  );

  return {
    done: doneRow?.done ?? 0,
    total: totalRow?.total ?? 0,
  };
}
