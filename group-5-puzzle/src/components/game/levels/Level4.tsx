"use client";

import { PuzzleLevel } from "./PuzzleLevel";
export function Level4(p: { resetKey: number; onSolved: () => void }) {
  return (
    <PuzzleLevel
      config={{
        level: 4,
        cols: 4,
        rows: 3,
        letter: "T",
        title: "Covert Broadcast Relay",
        location: "Encrypted Storage",
        image: "/puzzles/puzzle-4.jpg",
      }}
      {...p}
    />
  );
}
