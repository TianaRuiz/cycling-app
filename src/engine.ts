import type { Block } from "./workouts";

export type TimelineBlock = Block & { startSec: number; endSec: number };

export function buildTimeline(blocks: Block[]): TimelineBlock[] {
  let t = 0;
  return blocks.map((b) => {
    const startSec = t;
    const endSec = t + b.durationSec;
    t = endSec;
    return { ...b, startSec, endSec };
  });
}

export function totalDurationSec(blocks: Block[]): number {
  return blocks.reduce((sum, b) => sum + b.durationSec, 0);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function getBlockAt(timeline: TimelineBlock[], elapsedSec: number) {
  if (timeline.length === 0) return null;

  const total = timeline[timeline.length - 1].endSec;
  const e = clamp(elapsedSec, 0, Math.max(0, total - 0.001)); // avoid landing exactly on end

  const idx = timeline.findIndex((b) => e >= b.startSec && e < b.endSec);
  const blockIndex = idx === -1 ? timeline.length - 1 : idx;
  const block = timeline[blockIndex];

  const intoBlockSec = Math.floor(e - block.startSec);
  const remainingInBlockSec = Math.max(0, block.durationSec - intoBlockSec);
  const remainingTotalSec = Math.max(0, Math.ceil(total - e));

  return { blockIndex, block, intoBlockSec, remainingInBlockSec, remainingTotalSec, totalSec: total };
}

export function formatMMSS(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function formatCue(v: any): string {
  if (!v) return "—";
  if (typeof v === "string") return v;
  if (typeof v?.min === "number" && typeof v?.max === "number") return `${v.min}–${v.max}`;
  return "—";
}
