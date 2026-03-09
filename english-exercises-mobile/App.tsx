import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { AppNavigator } from "./src/app/AppNavigator";
import { initDb } from "./src/services/db/db";
import { loadSettings } from "./src/state/settingsStore";

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await loadSettings();
        await initDb();
        setReady(true);
      } catch (err) {
        setError(String(err));
      }
    })();
  }, []);

  if (error) {
    return (
      <SafeAreaView>
        <Text>Erro ao inicializar app: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!ready) {
    return (
      <SafeAreaView>
        <Text>Inicializando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
