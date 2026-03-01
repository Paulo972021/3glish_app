import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("english_exercises.db");
  }
  return db;
}

export async function initDb(): Promise<void> {
  const database = await getDb();
  await database.execAsync(SCHEMA_SQL);
}
