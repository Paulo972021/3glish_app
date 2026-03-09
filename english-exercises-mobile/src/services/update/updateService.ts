import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { Linking } from "react-native";

export type UpdateStatus = "up_to_date" | "ota_available" | "requires_new_apk" | "error";

export type VersionInfo = {
  appVersion: string;
  channel: string;
  runtimeVersion: string;
};

export type UpdateCheckResult = {
  status: UpdateStatus;
  message: string;
  versionInfo: VersionInfo;
  buildUrl?: string;
};

const REMOTE_BUILD_INFO_URL = "";

function getConfigVersion(): string {
  const fromExpoConfig = Constants.expoConfig?.version;
  if (fromExpoConfig) return fromExpoConfig;

  const fromManifest = (Constants.manifest2 as any)?.extra?.expoClient?.version;
  if (fromManifest) return String(fromManifest);

  return "desconhecida";
}

function getChannel(): string {
  return Updates.channel ?? "default";
}

function getRuntimeVersion(): string {
  const runtime = (Updates as any).runtimeVersion;
  return runtime ? String(runtime) : "desconhecida";
}

export function getCurrentVersionInfo(): VersionInfo {
  return {
    appVersion: getConfigVersion(),
    channel: getChannel(),
    runtimeVersion: getRuntimeVersion(),
  };
}

async function checkRemoteBuildRequirement(): Promise<{ requiresNewApk: boolean; buildUrl?: string }> {
  if (!REMOTE_BUILD_INFO_URL) {
    return { requiresNewApk: false };
  }

  try {
    const resp = await fetch(REMOTE_BUILD_INFO_URL);
    if (!resp.ok) return { requiresNewApk: false };

    const data = (await resp.json()) as {
      requires_new_apk?: boolean;
      build_url?: string;
    };

    return {
      requiresNewApk: Boolean(data.requires_new_apk),
      buildUrl: data.build_url,
    };
  } catch {
    return { requiresNewApk: false };
  }
}

export async function checkForUpdates(): Promise<UpdateCheckResult> {
  const versionInfo = getCurrentVersionInfo();

  try {
    if (!Updates.isEnabled) {
      return {
        status: "up_to_date",
        message: "Atualizações OTA indisponíveis neste ambiente.",
        versionInfo,
      };
    }

    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      return {
        status: "ota_available",
        message: "Atualização OTA disponível.",
        versionInfo,
      };
    }

    const remote = await checkRemoteBuildRequirement();
    if (remote.requiresNewApk) {
      return {
        status: "requires_new_apk",
        message: "Esta atualização exige uma nova instalação do app.",
        versionInfo,
        buildUrl: remote.buildUrl,
      };
    }

    return {
      status: "up_to_date",
      message: "O app já está atualizado.",
      versionInfo,
    };
  } catch (err) {
    return {
      status: "error",
      message: `Não foi possível verificar atualização (offline/rede): ${String(err)}`,
      versionInfo,
    };
  }
}

export async function downloadAndApplyOtaUpdate(): Promise<UpdateCheckResult> {
  const versionInfo = getCurrentVersionInfo();

  try {
    if (!Updates.isEnabled) {
      return {
        status: "error",
        message: "Atualizações OTA não estão habilitadas neste ambiente.",
        versionInfo,
      };
    }

    const update = await Updates.checkForUpdateAsync();
    if (!update.isAvailable) {
      return {
        status: "up_to_date",
        message: "O app já está atualizado.",
        versionInfo,
      };
    }

    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();

    return {
      status: "ota_available",
      message: "Atualização baixada. Reiniciando app...",
      versionInfo,
    };
  } catch (err) {
    return {
      status: "error",
      message: `Falha ao baixar/aplicar atualização OTA: ${String(err)}`,
      versionInfo,
    };
  }
}

export async function openBuildUrl(buildUrl?: string): Promise<boolean> {
  if (!buildUrl) return false;

  try {
    const supported = await Linking.canOpenURL(buildUrl);
    if (!supported) return false;
    await Linking.openURL(buildUrl);
    return true;
  } catch {
    return false;
  }
}
