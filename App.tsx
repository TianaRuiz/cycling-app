import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { WORKOUTS, type WorkoutTemplate } from "./src/workouts";
import { WorkoutPicker } from "./src/WorkoutPicker";
import { Player } from "./src/Player";

export default function App() {
  const [selected, setSelected] = useState<WorkoutTemplate | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      {selected ? (
        <Player workout={selected} onExit={() => setSelected(null)} />
      ) : (
        <WorkoutPicker workouts={WORKOUTS} onPick={setSelected} />
      )}
    </SafeAreaView>
  );
}
