import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { getAudioSpeedDefault, setAudioSpeedDefault } from "../state/settingsStore";

export function SettingsScreen() {
  const [speed, setSpeed] = useState(getAudioSpeedDefault());

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Velocidade padrão do áudio: {speed.toFixed(2)}x</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[0.75, 1.0, 1.25, 1.5].map((s) => (
          <Pressable
            key={s}
            onPress={() => {
              setAudioSpeedDefault(s);
              setSpeed(s);
            }}
            style={{ borderWidth: 1, borderRadius: 8, padding: 8 }}
          >
            <Text>{s}x</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
