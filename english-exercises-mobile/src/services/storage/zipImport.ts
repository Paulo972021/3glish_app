import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import JSZip from "jszip";
import { UiModel } from "../../core/contracts/types";
import { assertSupportedViewType } from "../../core/adapters/uiModelDispatcher";
import { upsertExercise } from "../db/exercisesRepo";
import { upsertPack } from "../db/packsRepo";
import { APP_ROOT, packRoot } from "./paths";

type Manifest = {
  schema_version?: string;
  pack_id: string;
  files: { exercises_jsonl: string; audio_root?: string };
};

async function ensureDir(path: string) {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

function makeUiModel(ex: any, packId: string): UiModel {
  if (!ex.ui_model) {
    throw new Error(`Exercise sem ui_model: ${ex.exercise_id}`);
  }

  const ui = {
    ...ex.ui_model,
    exercise_id: ex.exercise_id,
    pack_id: packId,
    modality: ex.modality,
    audio_spec: ex.ui_model.audio_spec ?? null,
  } as UiModel;

  assertSupportedViewType(ui);
  return ui;
}

export async function pickAndImportPack(): Promise<{ packId: string }> {
  await ensureDir(APP_ROOT);

  const res = await DocumentPicker.getDocumentAsync({
    type: ["application/zip", "application/octet-stream"],
    copyToCacheDirectory: true,
  });

  if (res.canceled) throw new Error("Importação cancelada.");

  const fileUri = res.assets[0].uri;
  const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
  const zip = await JSZip.loadAsync(base64, { base64: true });

  const manifestFile = zip.file("manifest.json");
  if (!manifestFile) throw new Error("manifest.json não encontrado no zip.");

  const manifestText = await manifestFile.async("string");
  const manifest: Manifest = JSON.parse(manifestText);

  if (!manifest.pack_id) throw new Error("manifest.pack_id ausente.");
  if (!manifest.files?.exercises_jsonl) throw new Error("manifest.files.exercises_jsonl ausente.");

  const root = packRoot(manifest.pack_id);
  await ensureDir(root);

  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;
    const outPath = root + entry.name;
    await ensureDir(outPath.substring(0, outPath.lastIndexOf("/") + 1));

    const contentB64 = await entry.async("base64");
    await FileSystem.writeAsStringAsync(outPath, contentB64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  await upsertPack(manifest.pack_id, manifestText);

  const exercisesPath = root + manifest.files.exercises_jsonl;
  const text = await FileSystem.readAsStringAsync(exercisesPath, { encoding: FileSystem.EncodingType.UTF8 });
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  for (const line of lines) {
    const ex = JSON.parse(line);
    const uiModel = makeUiModel(ex, manifest.pack_id);

    await upsertExercise({
      exerciseId: ex.exercise_id,
      packId: manifest.pack_id,
      modality: ex.modality,
      audioFile: uiModel.audio_spec?.path ?? null,
      payloadJson: JSON.stringify(ex),
      uiModel,
    });
  }

  return { packId: manifest.pack_id };
}
