import React, { useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import type { WorkoutTemplate } from "./workouts";
import { formatCue, formatMMSS } from "./engine";
import { useWorkoutTimer } from "./useWorkoutTimer";

export function Player({
  workout,
  onExit,
}: {
  workout: WorkoutTemplate;
  onExit: () => void;
}) {
  useKeepAwake();

  const { status, current, totalSec, start, pause, resume, reset, skipBlock } =
    useWorkoutTimer(workout.blocks);

  const lastBlockIndexRef = useRef<number | null>(null);

  // haptic on block change
  useEffect(() => {
    const idx = current?.blockIndex ?? null;
    if (idx == null) return;

    if (lastBlockIndexRef.current == null) {
      lastBlockIndexRef.current = idx;
      return;
    }
    if (idx !== lastBlockIndexRef.current) {
      lastBlockIndexRef.current = idx;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [current?.blockIndex]);

  function getBlockIntensity(block: {})

  const header = useMemo(() => {
    if (!current) return { title: "—", blockTime: "—", totalTime: "—" };
    return {
      title: current.block.label,
      blockTime: `${formatMMSS(current.remainingInBlockSec)} left in block`,
      totalTime: `${formatMMSS(current.remainingTotalSec)} left total`,
    };
  }, [current]);

  const cadence = current ? formatCue(current.block.cadence) : "—";
  const resistance = current ? formatCue(current.block.resistance) : "—";

  const primaryLabel =
    status === "running" ? "Pause" : status === "paused" ? "Resume" : status === "finished" ? "Restart" : "Start";

  const onPrimary = () => {
    if (status === "running") return pause();
    if (status === "paused") return resume();
    return start();
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Pressable onPress={onExit} style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Back</Text>
        </Pressable>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Pressable onPress={reset} style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Reset</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Text style={styles.blockTitle}>{header.title}</Text>
        <Text style={styles.timerBig}>{header.totalTime}</Text>
        <Text style={styles.timerSmall}>{header.blockTime}</Text>

        <View style={styles.cues}>
          <View style={styles.cueCard}>
            <Text style={styles.cueLabel}>Cadence</Text>
            <Text style={styles.cueValue}>{cadence}</Text>
          </View>
          <View style={styles.cueCard}>
            <Text style={styles.cueLabel}>Resistance</Text>
            <Text style={styles.cueValue}>{resistance}</Text>
          </View>
        </View>

        <Text style={styles.progressText}>
          {current ? `Block ${current.blockIndex + 1} of ${workout.blocks.length}` : ""} · Total {formatMMSS(totalSec)}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={skipBlock} style={[styles.btn, styles.secondary]}>
          <Text style={styles.btnText}>Skip Block</Text>
        </Pressable>

        <Pressable onPress={onPrimary} style={[styles.btn, styles.primary]}>
          <Text style={[styles.btnText, styles.primaryText]}>{primaryLabel}</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>
        Status: {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, paddingTop: 48, backgroundColor: "#fff" },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: "#ddd" },
  smallBtnText: { fontWeight: "600" },
  workoutName: { fontSize: 16, fontWeight: "700", flex: 1, textAlign: "center" },

  center: { flex: 1, justifyContent: "center", gap: 10 },
  blockTitle: { fontSize: 30, fontWeight: "800", textAlign: "center" },
  timerBig: { fontSize: 42, fontWeight: "900", textAlign: "center" },
  timerSmall: { fontSize: 16, color: "#555", textAlign: "center" },

  cues: { flexDirection: "row", gap: 12, marginTop: 10 },
  cueCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#eee", backgroundColor: "#fafafa" },
  cueLabel: { fontSize: 12, color: "#666", fontWeight: "700" },
  cueValue: { fontSize: 24, fontWeight: "900", marginTop: 6, textAlign: "center" },

  progressText: { marginTop: 10, textAlign: "center", color: "#666", fontWeight: "600" },

  controls: { gap: 12, paddingBottom: 10 },
  btn: { paddingVertical: 16, borderRadius: 18, alignItems: "center" },
  primary: { backgroundColor: "#111" },
  secondary: { backgroundColor: "#f2f2f2" },
  btnText: { fontSize: 16, fontWeight: "800" },
  primaryText: { color: "#fff" },

  footer: { textAlign: "center", color: "#777", paddingBottom: 10 },
});
