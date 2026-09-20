"use client";

import { PuzzleLevel } from "./PuzzleLevel";
export function Level2(p: { resetKey: number; onSolved: () => void }) {
  return (
    <PuzzleLevel
      config={{
        level: 2,
        cols: 3,
        rows: 2,
        letter: "U",
        title: "Behavioral Data Node",
        location: "Server Archive 02",
        image: "/puzzles/puzzle-2.jpg",
      }}
      {...p}
    />
  );
}
