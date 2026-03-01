import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { UiModel } from "../core/contracts/types";
import { HomeScreen } from "../screens/HomeScreen";
import { ImportPackScreen } from "../screens/ImportPackScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { SolveScreen } from "../screens/SolveScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { getDarkModeEnabled } from "../state/settingsStore";

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

  const backToMenu = () => setRoute("home");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? "#111827" : "#ffffff" }}>
      {route === "home" && (
        <HomeScreen
          darkMode={darkMode}
          onImport={() => setRoute("import")}
          onSolve={() => setRoute("solve")}
          onStats={() => setRoute("stats")}
          onSettings={() => setRoute("settings")}
          onBackToMenu={backToMenu}
        />
      )}
      {route === "import" && <ImportPackScreen onBack={backToMenu} darkMode={darkMode} />}
      {route === "solve" && <SolveScreen uiModel={demoUi} onBack={backToMenu} darkMode={darkMode} />}
      {route === "stats" && <StatsScreen packId="demo-pack" onBack={backToMenu} darkMode={darkMode} />}
      {route === "settings" && <SettingsScreen darkMode={darkMode} onToggleDarkMode={setDarkMode} onBack={backToMenu} />}
    </SafeAreaView>
  );
}
