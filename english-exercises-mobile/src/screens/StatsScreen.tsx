import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { getGlobalStats } from "../services/db/statsRepo";
import { theme } from "../theme/theme";

export function StatsScreen({
  packId,
  onBack,
  darkMode = true,
}: {
  packId: string;
  onBack: () => void;
  darkMode?: boolean;
}) {
  const [stats, setStats] = useState({ done_total: 0, correct_total: 0, wrong_total: 0 });
  const text = darkMode ? theme.colors.textPrimary : theme.colors.lightText;

  useEffect(() => {
    getGlobalStats(packId).then(setStats).catch(() => undefined);
  }, [packId]);

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ gap: theme.spacing.sm, flex: 1 }}>
        <Text style={{ color: text, fontSize: theme.typography.h2, fontWeight: "800" }}>ESTATÍSTICAS</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Feitos: {stats.done_total}</Text>
        <Text style={{ color: theme.colors.success }}>Certos: {stats.correct_total}</Text>
        <Text style={{ color: theme.colors.error }}>Errados: {stats.wrong_total}</Text>
        <MenuButton onPress={onBack} darkMode={darkMode} />
      </View>
    </ScreenContainer>
  );
}
