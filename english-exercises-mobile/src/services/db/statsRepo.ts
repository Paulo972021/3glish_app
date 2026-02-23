import { getDb } from "./db";

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
