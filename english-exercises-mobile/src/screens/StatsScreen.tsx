import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getGlobalStats } from "../services/db/statsRepo";

export function StatsScreen({ packId }: { packId: string }) {
  const [stats, setStats] = useState({ done_total: 0, correct_total: 0, wrong_total: 0 });

  useEffect(() => {
    getGlobalStats(packId).then(setStats).catch(() => undefined);
  }, [packId]);

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text>Feitos: {stats.done_total}</Text>
      <Text>Certos: {stats.correct_total}</Text>
      <Text>Errados: {stats.wrong_total}</Text>
    </View>
  );
}
