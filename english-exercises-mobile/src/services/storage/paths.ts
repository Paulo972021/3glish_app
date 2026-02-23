import * as FileSystem from "expo-file-system";

export const APP_ROOT = `${FileSystem.documentDirectory}packs/`;
export const packRoot = (packId: string) => `${APP_ROOT}${packId}/`;
export const packAudioRoot = (packId: string) => `${packRoot(packId)}audio/`;
