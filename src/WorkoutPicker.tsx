import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { WorkoutTemplate } from "./workouts";

export function WorkoutPicker({
  workouts,
  onPick,
}: {
  workouts: WorkoutTemplate[];
  onPick: (w: WorkoutTemplate) => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Pick a workout</Text>
      {workouts.map((w) => (
        <Pressable key={w.id} style={styles.card} onPress={() => onPick(w)}>
          <Text style={styles.cardTitle}>{w.name}</Text>
          <Text style={styles.cardSub}>{w.blocks.length} blocks</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, paddingTop: 48, gap: 12 },
  title: { fontSize: 28, fontWeight: "700" },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    gap: 6,
  },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardSub: { fontSize: 14, color: "#555" },
});
