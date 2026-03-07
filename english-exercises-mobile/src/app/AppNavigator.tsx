import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { ImportPackScreen } from "../screens/ImportPackScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { SolveScreen } from "../screens/SolveScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { listPackIds } from "../services/db/packsRepo";
import { getDarkModeEnabled } from "../state/settingsStore";
import { theme } from "../theme/theme";

type Route = "home" | "import" | "solve" | "stats" | "settings";

export function AppNavigator() {
  const [route, setRoute] = useState<Route>("home");
  const [darkMode, setDarkMode] = useState(getDarkModeEnabled());
  const [packIds, setPackIds] = useState<string[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  const backToMenu = () => setRoute("home");

  const refreshPacks = async () => {
    const ids = await listPackIds();
    setPackIds(ids);
    if (!selectedPackId && ids.length > 0) {
      setSelectedPackId(ids[0]);
    }
  };

  useEffect(() => {
    refreshPacks().catch(() => undefined);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? theme.colors.bgPrimary : theme.colors.lightBg }}>
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
      {route === "import" && (
        <ImportPackScreen
          onBack={backToMenu}
          darkMode={darkMode}
          onPackImported={(packId) => {
            setSelectedPackId(packId);
            refreshPacks().catch(() => undefined);
          }}
        />
      )}
      {route === "solve" && (
        <SolveScreen
          onBack={backToMenu}
          darkMode={darkMode}
          selectedPackId={selectedPackId}
          availablePackIds={packIds}
          onSelectPack={setSelectedPackId}
        />
      )}
      {route === "stats" && <StatsScreen onBack={backToMenu} darkMode={darkMode} />}
      {route === "settings" && <SettingsScreen darkMode={darkMode} onToggleDarkMode={setDarkMode} onBack={backToMenu} />}
    </View>
  );
}
