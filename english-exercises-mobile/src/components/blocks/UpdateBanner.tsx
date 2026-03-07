import React from "react";
import { Pressable, Text, View } from "react-native";
import { UpdateCheckResult } from "../../services/update/updateService";
import { theme } from "../../theme/theme";

export function UpdateBanner({
  result,
  onApply,
  onOpenBuild,
  onDismiss,
}: {
  result: UpdateCheckResult;
  onApply: () => void;
  onOpenBuild: () => void;
  onDismiss: () => void;
}) {
  const isOta = result.status === "ota_available";
  const isApk = result.status === "requires_new_apk";

  return (
    <View
      style={{
        borderWidth: theme.border.normal,
        borderColor: theme.colors.neon,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.sm,
        gap: theme.spacing.xs,
      }}
    >
      <Text style={{ color: theme.colors.textPrimary, fontWeight: "800" }}>{result.message}</Text>

      <View style={{ flexDirection: "row", gap: theme.spacing.xs, flexWrap: "wrap" }}>
        {isOta ? (
          <Pressable
            onPress={onApply}
            style={{
              borderWidth: theme.border.normal,
              borderColor: theme.colors.neon,
              borderRadius: theme.radius.sm,
              padding: theme.spacing.xs,
              backgroundColor: theme.colors.neon,
            }}
          >
            <Text style={{ color: theme.colors.black, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Baixar e aplicar
            </Text>
          </Pressable>
        ) : null}

        {isApk ? (
          <Pressable
            onPress={onOpenBuild}
            style={{
              borderWidth: theme.border.normal,
              borderColor: theme.colors.neon,
              borderRadius: theme.radius.sm,
              padding: theme.spacing.xs,
            }}
          >
            <Text style={{ color: theme.colors.neon, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Abrir link do app
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          onPress={onDismiss}
          style={{
            borderWidth: theme.border.normal,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.sm,
            padding: theme.spacing.xs,
          }}
        >
          <Text style={{ color: theme.colors.textSecondary, fontWeight: "700" }}>Fechar</Text>
        </Pressable>
      </View>
    </View>
  );
}
