import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import {
  checkForUpdates,
  downloadAndApplyOtaUpdate,
  getCurrentVersionInfo,
  openBuildUrl,
  UpdateCheckResult,
} from "../services/update/updateService";
import {
  getAudioSpeedDefault,
  setAudioSpeedDefault,
  setDarkModeEnabled,
} from "../state/settingsStore";
import { theme } from "../theme/theme";

export function SettingsScreen({
  darkMode,
  onToggleDarkMode,
  onBack,
}: {
  darkMode: boolean;
  onToggleDarkMode: (enabled: boolean) => void;
  onBack: () => void;
}) {
  const [speed, setSpeed] = useState(getAudioSpeedDefault());
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [lastCheck, setLastCheck] = useState<UpdateCheckResult | null>(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  const versionInfo = useMemo(() => getCurrentVersionInfo(), []);

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ gap: theme.spacing.sm, flex: 1 }}>
        <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.h2, fontWeight: "800" }}>CONFIGURAÇÕES</Text>

        <View style={{ gap: theme.spacing.xs }}>
          <Text style={{ color: theme.colors.textSecondary }}>Versão: {versionInfo.appVersion}</Text>
          <Text style={{ color: theme.colors.textSecondary }}>Canal: {versionInfo.channel}</Text>
          <Text style={{ color: theme.colors.textSecondary }}>Runtime: {versionInfo.runtimeVersion}</Text>
        </View>

        <Text style={{ color: theme.colors.textSecondary }}>Velocidade padrão do áudio: {speed.toFixed(2)}x</Text>

        <View style={{ flexDirection: "row", gap: theme.spacing.xs, flexWrap: "wrap" }}>
          {[0.75, 1.0, 1.25, 1.5].map((s) => (
            <Pressable
              key={s}
              onPress={async () => {
                await setAudioSpeedDefault(s);
                setSpeed(s);
              }}
              style={{
                borderWidth: theme.border.normal,
                borderColor: theme.colors.neon,
                borderRadius: theme.radius.sm,
                padding: theme.spacing.xs,
                backgroundColor: speed === s ? theme.colors.neon : "transparent",
              }}
            >
              <Text style={{ color: speed === s ? theme.colors.black : theme.colors.neon, fontWeight: "800" }}>{s}x</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={async () => {
            const next = !darkMode;
            await setDarkModeEnabled(next);
            onToggleDarkMode(next);
          }}
          style={{
            borderWidth: theme.border.normal,
            borderColor: theme.colors.neon,
            borderRadius: theme.radius.sm,
            padding: theme.spacing.sm,
            backgroundColor: darkMode ? "transparent" : theme.colors.neon,
          }}
        >
          <Text
            style={{
              color: darkMode ? theme.colors.neon : theme.colors.black,
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            {darkMode ? "Desativar modo escuro" : "Ativar modo escuro"}
          </Text>
        </Pressable>

        <Pressable
          onPress={async () => {
            setCheckingUpdate(true);
            setUpdateStatus("Verificando atualização...");
            const result = await checkForUpdates();
            setLastCheck(result);
            setUpdateStatus(result.message);
            setCheckingUpdate(false);
          }}
          disabled={checkingUpdate}
          style={{
            borderWidth: theme.border.normal,
            borderColor: theme.colors.neon,
            borderRadius: theme.radius.sm,
            padding: theme.spacing.sm,
            backgroundColor: checkingUpdate ? theme.colors.textSecondary : theme.colors.neon,
          }}
        >
          <Text style={{ color: theme.colors.black, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5 }}>
            {checkingUpdate ? "Verificando..." : "Verificar atualização"}
          </Text>
        </Pressable>

        {lastCheck?.status === "ota_available" ? (
          <Pressable
            onPress={async () => {
              setUpdateStatus("Baixando atualização...");
              const result = await downloadAndApplyOtaUpdate();
              setLastCheck(result);
              setUpdateStatus(result.message);
            }}
            style={{
              borderWidth: theme.border.normal,
              borderColor: theme.colors.neon,
              borderRadius: theme.radius.sm,
              padding: theme.spacing.sm,
            }}
          >
            <Text style={{ color: theme.colors.neon, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Baixar e aplicar atualização
            </Text>
          </Pressable>
        ) : null}

        {lastCheck?.status === "requires_new_apk" ? (
          <Pressable
            onPress={async () => {
              const opened = await openBuildUrl(lastCheck.buildUrl);
              if (!opened) {
                setUpdateStatus("Não foi possível abrir o link da nova instalação.");
              }
            }}
            style={{
              borderWidth: theme.border.normal,
              borderColor: theme.colors.neon,
              borderRadius: theme.radius.sm,
              padding: theme.spacing.sm,
            }}
          >
            <Text style={{ color: theme.colors.neon, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Abrir link da nova instalação
            </Text>
          </Pressable>
        ) : null}

        {updateStatus ? <Text style={{ color: theme.colors.textSecondary }}>{updateStatus}</Text> : null}

        <MenuButton onPress={onBack} darkMode={darkMode} />
      </View>
    </ScreenContainer>
  );
}
