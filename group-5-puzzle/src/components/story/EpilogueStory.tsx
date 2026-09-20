"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";

export function EpilogueStory() {
  const game = useGame();
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 text-center">
      <div className="w-full max-w-2xl animate-fade-in">
        <p className="eyebrow">Final recording</p>
        <p className="mx-auto mt-6 max-w-xl text-lg italic leading-relaxed text-muted-foreground">
          &ldquo;They took everything from us, but they couldn&apos;t erase the evidence.
          If you&apos;re hearing this, you know what we discovered and what they tried to hide.&rdquo;
        </p>
        <p className="mt-8 text-sm uppercase tracking-[.2em] text-muted-foreground">
          The evidence is automatically released to the public.
        </p>
        <h1 className="mt-6 font-display text-4xl tracking-widest text-foreground md:text-6xl">
          PROJECT NEURO: EXPOSED
        </h1>
        <div className="mt-10">
          <Button variant="investigate" size="lg" onClick={() => game.setScreen("results")}>
            View case file<ArrowRight />
          </Button>
        </div>
      </div>
    </main>
  );
}
