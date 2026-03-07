import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MenuButton } from "../components/blocks/MenuButton";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import {
  getGlobalStatsByPeriod,
  getMostErrorWords,
  getStatsByModality,
  StatsPeriod,
} from "../services/db/statsRepo";
import { theme } from "../theme/theme";

const PERIODS: Array<{ label: string; value: StatsPeriod }> = [
  { label: "Hoje", value: "today" },
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "Tudo", value: "all" },
];

export function StatsScreen({ onBack, darkMode = true }: { onBack: () => void; darkMode?: boolean }) {
  const [period, setPeriod] = useState<StatsPeriod>("7d");
  const [totals, setTotals] = useState({
    done_total: 0,
    correct_total: 0,
    wrong_total: 0,
    avg_done_per_day: 0,
    avg_correct_per_day: 0,
    avg_wrong_per_day: 0,
  });
  const [byModality, setByModality] = useState<Array<{ modality: string; done: number; correct: number; wrong: number }>>([]);
  const [errorWords, setErrorWords] = useState<Array<{ word: string; errors: number }>>([]);

  const text = darkMode ? theme.colors.textPrimary : theme.colors.lightText;

  useEffect(() => {
    (async () => {
      const [t, m, w] = await Promise.all([
        getGlobalStatsByPeriod(period),
        getStatsByModality(period),
        getMostErrorWords(period, 10),
      ]);
      setTotals(t);
      setByModality(m);
      setErrorWords(w);
    })().catch(() => undefined);
  }, [period]);

  return (
    <ScreenContainer darkMode={darkMode}>
      <View style={{ gap: theme.spacing.sm, flex: 1 }}>
        <Text style={{ color: text, fontSize: theme.typography.h2, fontWeight: "800" }}>ESTATÍSTICAS GERAIS</Text>

        <View style={{ flexDirection: "row", gap: theme.spacing.xs, flexWrap: "wrap" }}>
          {PERIODS.map((p) => (
            <Pressable
              key={p.value}
              onPress={() => setPeriod(p.value)}
              style={{
                borderWidth: theme.border.normal,
                borderColor: theme.colors.neon,
                borderRadius: theme.radius.sm,
                padding: theme.spacing.xs,
                backgroundColor: period === p.value ? theme.colors.neon : "transparent",
              }}
            >
              <Text style={{ color: period === p.value ? theme.colors.black : theme.colors.neon, fontWeight: "800" }}>{p.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ color: theme.colors.textSecondary }}>Feitos: {totals.done_total}</Text>
        <Text style={{ color: theme.colors.success }}>Certos: {totals.correct_total}</Text>
        <Text style={{ color: theme.colors.error }}>Errados: {totals.wrong_total}</Text>

        <Text style={{ color: text, fontWeight: "800" }}>Média por dia</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Feitos/dia: {totals.avg_done_per_day}</Text>
        <Text style={{ color: theme.colors.success }}>Certos/dia: {totals.avg_correct_per_day}</Text>
        <Text style={{ color: theme.colors.error }}>Errados/dia: {totals.avg_wrong_per_day}</Text>

        <Text style={{ color: text, fontWeight: "800", marginTop: 8 }}>Por modalidade</Text>
        {byModality.length === 0 ? (
          <Text style={{ color: theme.colors.textSecondary }}>Sem dados no período selecionado.</Text>
        ) : (
          byModality.map((m) => (
            <Text key={m.modality} style={{ color: theme.colors.textSecondary }}>
              {m.modality}: {m.done} feitos / {m.correct} certos / {m.wrong} errados
            </Text>
          ))
        )}

        <Text style={{ color: text, fontWeight: "800", marginTop: 8 }}>Palavras com mais erros</Text>
        {errorWords.length === 0 ? (
          <Text style={{ color: theme.colors.textSecondary }}>Sem palavras com erro no período.</Text>
        ) : (
          errorWords.map((w) => (
            <Text key={w.word} style={{ color: theme.colors.error }}>
              {w.word}: {w.errors}
            </Text>
          ))
        )}

        <MenuButton onPress={onBack} darkMode={darkMode} />
      </View>
    </ScreenContainer>
  );
}
