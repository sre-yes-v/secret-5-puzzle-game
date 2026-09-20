"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/api";
import { LeaderBoardTable } from "./LeaderBoardTable";

export function LeaderBoardMain() {
  const game = useGame();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLeaderboard()
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load the leaderboard. Try again shortly.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8">
      <Button
        variant="ghost"
        onClick={() => game.setScreen(game.running ? "results" : "home")}
      >
        <ArrowLeft />
        Back
      </Button>
      <div className="mb-8 mt-12 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Hall of investigators</p>
          <h1 className="mt-2 font-display text-5xl text-foreground md:text-7xl">
            Leaderboard
          </h1>
        </div>
        <Trophy className="size-10 text-evidence" />
      </div>
      {loading && (
        <p className="text-sm text-muted-foreground">Loading leaderboard…</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && (
        <LeaderBoardTable scores={entries} currentName={game.name} />
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Showing the top 20 fastest investigations · fastest completed first.
      </p>
     <p className="mt-1 text-xs text-muted-foreground">
      Email is shown so returning players can recognize their own entry.
    </p>
    </main>
  );
}