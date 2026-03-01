import { getDb } from "./db";

export async function upsertPack(packId: string, manifestJson: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO packs (pack_id, manifest_json, imported_at)
     VALUES (?, ?, ?)`,
    [packId, manifestJson, new Date().toISOString()]
  );
}
