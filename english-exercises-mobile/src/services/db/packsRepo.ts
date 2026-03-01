import { getDb } from "./db";

export async function upsertPack(packId: string, manifestJson: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO packs (pack_id, manifest_json, imported_at)
     VALUES (?, ?, ?)`,
    [packId, manifestJson, new Date().toISOString()]
  );
}

export async function listPackIds(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ pack_id: string }>(
    `SELECT pack_id FROM packs ORDER BY imported_at DESC`
  );
  return rows.map((r) => r.pack_id);
}
