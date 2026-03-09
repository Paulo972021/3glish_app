import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { theme } from "../../theme/theme";

export function ScreenContainer({
  darkMode,
  children,
}: {
  darkMode: boolean;
  children: React.ReactNode;
}) {
  const bg = darkMode ? theme.colors.bgPrimary : theme.colors.lightBg;
  const topInset = (StatusBar.currentHeight ?? 0) + theme.spacing.sm;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1, paddingTop: topInset, paddingHorizontal: theme.spacing.sm }}>{children}</View>
    </SafeAreaView>
  );
}
