import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { UiModel } from "../core/contracts/types";
import { getDarkModeEnabled } from "../state/settingsStore";
import { HomeScreen } from "../screens/HomeScreen";
import { ImportPackScreen } from "../screens/ImportPackScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { SolveScreen } from "../screens/SolveScreen";
import { StatsScreen } from "../screens/StatsScreen";

type Route = "home" | "import" | "solve" | "stats" | "settings";

const DEMO_UI: UiModel = {
  exercise_id: "demo-1",
  pack_id: "demo-pack",
  modality: "translation",
  view_type: "free_text",
  title: "Traduza",
  prompt_blocks: [{ type: "text", value: "I am learning English." }],
  input_spec: { kind: "text", placeholder: "Digite sua resposta..." },
  grading_spec: { gradable: true, kind: "match_any_answer", accepted_answers: ["eu estou aprendendo inglês"] },
  audio_spec: null,
  feedback_spec: { show_after_submit: true },
};

export function AppNavigator() {
  const [route, setRoute] = useState<Route>("home");
  const [darkMode, setDarkMode] = useState(getDarkModeEnabled());
  const demoUi = useMemo(() => DEMO_UI, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? "#111827" : "#ffffff" }}>
      {route === "home" && (
        <HomeScreen
          darkMode={darkMode}
          onImport={() => setRoute("import")}
          onSolve={() => setRoute("solve")}
          onStats={() => setRoute("stats")}
          onSettings={() => setRoute("settings")}
        />
      )}
      {route === "import" && <ImportPackScreen onBack={() => setRoute("home")} />}
      {route === "solve" && <SolveScreen uiModel={demoUi} />}
      {route === "stats" && <StatsScreen packId="demo-pack" />}
      {route === "settings" && <SettingsScreen darkMode={darkMode} onToggleDarkMode={setDarkMode} />}
    </SafeAreaView>
  );
}
