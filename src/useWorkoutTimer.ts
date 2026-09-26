import { useEffect, useMemo, useRef, useState } from "react";
import type { Block } from "./workouts";
import { buildTimeline, getBlockAt, totalDurationSec } from "./engine";

type Status = "idle" | "running" | "paused" | "finished";

export function useWorkoutTimer(blocks: Block[]) {
  const timeline = useMemo(() => buildTimeline(blocks), [blocks]);
  const totalSec = useMemo(() => totalDurationSec(blocks), [blocks]);

  const [status, setStatus] = useState<Status>("idle");
  const [elapsedSec, setElapsedSec] = useState(0);

  const startEpochMsRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);

  // tick
  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      const now = Date.now();
      const startEpoch = startEpochMsRef.current ?? now;
      startEpochMsRef.current = startEpoch;

      const ms = accumulatedMsRef.current + (now - startEpoch);
      const nextElapsed = Math.min(totalSec, Math.floor(ms / 1000));

      setElapsedSec(nextElapsed);
      if (nextElapsed >= totalSec) {
        setStatus("finished");
      }
    }, 250);

    return () => clearInterval(id);
  }, [status, totalSec]);

  // when pausing, freeze accumulated
  useEffect(() => {
    if (status !== "paused") return;
    const startEpoch = startEpochMsRef.current;
    if (startEpoch != null) {
      accumulatedMsRef.current += Date.now() - startEpoch;
    }
    startEpochMsRef.current = null;
  }, [status]);

  const current = useMemo(() => getBlockAt(timeline, elapsedSec), [timeline, elapsedSec]);

  const start = () => {
    if (status === "finished") {
      // restart behavior
      accumulatedMsRef.current = 0;
      startEpochMsRef.current = Date.now();
      setElapsedSec(0);
      setStatus("running");
      return;
    }
    if (status === "running") return;
    if (status === "idle") {
      accumulatedMsRef.current = 0;
      setElapsedSec(0);
    }
    startEpochMsRef.current = Date.now();
    setStatus("running");
  };

  const pause = () => {
    if (status !== "running") return;
    setStatus("paused");
  };

  const resume = () => {
    if (status !== "paused") return;
    startEpochMsRef.current = Date.now();
    setStatus("running");
  };

  const reset = () => {
    accumulatedMsRef.current = 0;
    startEpochMsRef.current = null;
    setElapsedSec(0);
    setStatus("idle");
  };

  const skipBlock = () => {
    if (!current) return;
    const nextStart = current.block.endSec;
    // set elapsed to next block start
    accumulatedMsRef.current = nextStart * 1000;
    startEpochMsRef.current = status === "running" ? Date.now() : null;
    setElapsedSec(nextStart);
    if (nextStart >= totalSec) setStatus("finished");
  };

  return { status, elapsedSec, totalSec, current, start, pause, resume, reset, skipBlock };
}
