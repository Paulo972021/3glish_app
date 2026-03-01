import * as FileSystem from "expo-file-system";

export const APP_ROOT = `${FileSystem.documentDirectory}packs/`;
export const packRoot = (packId: string) => `${APP_ROOT}${packId}/`;
export const packAudioRoot = (packId: string) => `${packRoot(packId)}audio/`;

/**
 * Converte um path relativo dentro do pack (ex: "audio/2026-02-22/x.wav")
 * em uma URI real do FileSystem (ex: ".../documentDirectory/packs/<packId>/audio/...")
 */
export function resolvePackFileUri(packId: string, relativePath: string): string {
  const rel = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${packRoot(packId)}${rel}`;
}
