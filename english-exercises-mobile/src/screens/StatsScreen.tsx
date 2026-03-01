import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { getGlobalStats } from "../services/db/statsRepo";

export function StatsScreen({
  packId,
  onBack,
  darkMode = false,
}: {
  packId: string;
  onBack: () => void;
  darkMode?: boolean;
}) {
  const [stats, setStats] = useState({ done_total: 0, correct_total: 0, wrong_total: 0 });

  useEffect(() => {
    getGlobalStats(packId).then(setStats).catch(() => undefined);
  }, [packId]);

  return (
    <View style={{ padding: 16, gap: 8, flex: 1 }}>
      <Text>Feitos: {stats.done_total}</Text>
      <Text>Certos: {stats.correct_total}</Text>
      <Text>Errados: {stats.wrong_total}</Text>
      <MenuButton onPress={onBack} darkMode={darkMode} />
    </View>
  );
}
