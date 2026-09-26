export type Range = { min: number; max: number };
export type CueValue = Range | string | undefined;

export type Block = {
  id: string;
  label: string;
  durationSec: number;
  cadence?: CueValue;
  resistance?: CueValue;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  blocks: Block[];
};

const r = (min: number, max: number): Range => ({ min, max });

export const WORKOUTS: WorkoutTemplate[] = [
  {
    id: "intervals20",
    name: "20 min Intervals",
    blocks: [
      { id: "wu", label: "Warmup", durationSec: 180, cadence: r(80, 95), resistance: r(20, 30) },
      // 7 rounds of 1:00 hard + 1:00 easy = 14:00
      ...Array.from({ length: 7 }).flatMap((_, i) => [
        { id: `push-${i}`, label: "Push", durationSec: 60, cadence: r(90, 105), resistance: r(35, 50) },
        { id: `rec-${i}`, label: "Recover", durationSec: 60, cadence: r(75, 90), resistance: r(20, 30) },
      ]),
      { id: "cd", label: "Cooldown", durationSec: 180, cadence: r(70, 85), resistance: r(15, 25) },
    ],
  },
  {
    id: "climb20",
    name: "20 min Climb",
    blocks: [
      { id: "wu", label: "Warmup", durationSec: 180, cadence: r(75, 90), resistance: r(20, 30) },
      { id: "c1", label: "Climb 1", durationSec: 180, cadence: r(70, 85), resistance: r(35, 45) },
      { id: "c2", label: "Climb 2", durationSec: 180, cadence: r(65, 80), resistance: r(40, 55) },
      { id: "c3", label: "Climb 3", durationSec: 180, cadence: r(60, 75), resistance: r(45, 60) },
      { id: "c4", label: "Climb 4", durationSec: 180, cadence: r(60, 75), resistance: r(50, 65) },
      { id: "cd", label: "Cooldown", durationSec: 300, cadence: r(70, 85), resistance: r(15, 25) }, // 5:00
    ],
  },
  {
    id: "tempo20",
    name: "20 min Tempo",
    blocks: [
      { id: "wu", label: "Warmup", durationSec: 180, cadence: r(80, 95), resistance: r(20, 30) },
      { id: "t", label: "Tempo", durationSec: 720, cadence: r(85, 100), resistance: r(35, 45) }, // 12:00
      { id: "cd", label: "Cooldown", durationSec: 300, cadence: r(70, 85), resistance: r(15, 25) }, // 5:00
    ],
  },
];
