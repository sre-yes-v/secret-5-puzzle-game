"use client";

import { PuzzleLevel } from "./PuzzleLevel";
export function Level1(p: { resetKey: number; onSolved: () => void }) {
  return (
    <PuzzleLevel
      config={{
        level: 1,
        cols: 2,
        rows: 2,
        letter: "S",
        title: "Neural Interface Lab",
        location: "Project NEURO Terminal",
        image: "/puzzles/puzzle-1.jpg",
      }}
      {...p}
    />
  );
}
