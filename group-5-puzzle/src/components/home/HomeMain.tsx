"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, Fingerprint, Play, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
const Shell = ({
  children,
  narrow = false,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) => (
  <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
    <div className="scanline" />
    <div
      className={`relative z-10 w-full ${narrow ? "max-w-xl" : "max-w-5xl"}`}
    >
      {children}
    </div>
  </main>
);
export function LoadingScreen() {
  return (
    <Shell narrow>
      <div className="text-center">
        <div className="mx-auto mb-9 grid size-20 place-items-center border border-primary/40">
          <Eye className="size-9 text-primary animate-pulse" />
        </div>
        <div className="brand-mark justify-center text-5xl md:text-7xl">
          SECRET<span>5</span>
        </div>
        <p className="mt-4 text-sm uppercase tracking-[.32em] text-muted-foreground">
          Five files. One erased truth.
        </p>
        <div className="mx-auto mt-10 h-px w-64 overflow-hidden bg-border">
          <div className="h-full w-1/2 animate-loading bg-primary" />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[.2em] text-primary">
          Decrypting corrupted files
        </p>
      </div>
    </Shell>
  );
}
export function NameEntry() {
  const game = useGame();
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = game.name.trim();
    const trimmedEmail = game.email.trim();
    if (!trimmedName) {
      setError("A name is required to open the case.");
      game.playSound("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      game.playSound("error");
      return;
    }
    setError(null);
    await game.registerPlayerAndContinue(trimmedName, trimmedEmail);
  };

  return (
    <Shell narrow>
      <form
        onSubmit={submit}
        className="border border-border bg-card/90 p-7 shadow-vault backdrop-blur md:p-12"
      >
        <Fingerprint className="mb-8 size-9 text-primary" />
        <p className="eyebrow">Identity verification</p>
        <h1 className="mt-3 font-display text-4xl text-foreground md:text-6xl">
          You were the one they trusted.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Enter a name and email for the record. Someone erased everything else.
        </p>
        <label
          className="mt-9 block text-xs font-bold uppercase tracking-[.16em] text-muted-foreground"
          htmlFor="name"
        >
          Name for the record
        </label>
        <input
          id="name"
          autoFocus
          maxLength={22}
          value={game.name}
          onChange={(e) => {
            game.setName(e.target.value);
            setError(null);
          }}
          className="mt-2 h-14 w-full border border-input bg-input/30 px-4 text-lg text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Enter your name"
        />
        <label
          className="mt-6 block text-xs font-bold uppercase tracking-[.16em] text-muted-foreground"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          maxLength={80}
          value={game.email}
          onChange={(e) => {
            game.setEmail(e.target.value);
            setError(null);
          }}
          className="mt-2 h-14 w-full border border-input bg-input/30 px-4 text-lg text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="you@example.com"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Your email will be visible on the public leaderboard.
        </p>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {game.registerError && (
          <p className="mt-2 text-sm text-destructive">{game.registerError}</p>
        )}
        <Button
          type="submit"
          variant="investigate"
          size="lg"
          className="mt-6 w-full"
          disabled={game.registering}
        >
          {game.registering ? "Opening case…" : "Continue"}
          <ArrowRight />
        </Button>
      </form>
    </Shell>
  );
}
export function HomeMain() {
  const game = useGame();
  return (
    <Shell>
      <div className="grid items-end gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <p className="eyebrow">Project NEURO · Classified</p>
          </div>
          <div className="brand-mark text-7xl sm:text-8xl md:text-9xl">
            SECRET<span>5</span>
          </div>
          <p className="mt-5 font-display text-2xl italic text-muted-foreground md:text-3xl">
            Five files. One erased truth.
          </p>
          <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">
            Five corrupted images are all that survived. Restore each one,
            recover the letter hidden inside, and finish what a vanished
            research team couldn&apos;t.
          </p>
        </div>
        <div className="border-l border-border pl-7">
          <p className="mb-6 text-xs uppercase tracking-[.2em] text-muted-foreground">
            Assigned to <span className="text-foreground">{game.name}</span>
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="investigate"
              size="xl"
              onClick={() => {
                game.playSound("click");
                game.setScreen("briefing");
              }}
            >
              <Play />
              Play game
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => game.setScreen("instructions")}
            >
              <ScanLine />
              How to play
            </Button>
            <Button
              variant="ghost"
              onClick={() => game.setScreen("leaderboard")}
            >
              View leaderboard
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
export function Briefing() {
  const game = useGame();
  return (
    <Shell narrow>
      <div className="border border-border bg-card p-8 shadow-vault md:p-12">
        <p className="eyebrow">Mission briefing · Eyes only</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          The lab is hiding something.
        </h1>
        <div className="my-8 h-px bg-border" />
        <div className="space-y-5 text-lg leading-8 text-muted-foreground">
          <p>Five corrupted images are all that&apos;s left of Project NEURO.</p>
          <p>
            Restore each fragment to recover a letter. Collect all five and
            rearrange them to reveal what the research team was silenced for
            discovering.
          </p>
          <p className="text-foreground">
            They&apos;re still watching this channel. Move quickly.
          </p>
        </div>
        <Button
          variant="investigate"
          size="lg"
          className="mt-10 w-full"
          onClick={() => game.setScreen("instructions")}
        >
          Continue
          <ArrowRight />
        </Button>
      </div>
    </Shell>
  );
}
export function Instructions() {
  const game = useGame();
  const rules = [
    "Drag each fragment onto the corrupted image.",
    "Correct fragments snap and lock into place.",
    "Incorrect fragments return to the file tray.",
    "Fragments never rotate. Attempts are unlimited.",
    "Every restored image reveals one letter.",
    "Rearrange all five letters to expose the truth.",
  ];
  return (
    <Shell>
      <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="eyebrow">Field manual</p>
          <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">
            How to restore the files.
          </h1>
          <p className="mt-6 leading-7 text-muted-foreground">
            Your total time begins the moment you open the first file and
            ends only when the truth is correctly named.
          </p>
        </div>
        <div className="border border-border bg-card p-6 md:p-9">
          <ol className="grid gap-px bg-border sm:grid-cols-2">
            {rules.map((rule, i) => (
              <li key={rule} className="flex gap-4 bg-card p-5">
                <span className="font-mono text-xs text-primary">0{i + 1}</span>
                <span className="text-sm leading-6 text-muted-foreground">
                  {rule}
                </span>
              </li>
            ))}
          </ol>
          <Button
            variant="investigate"
            size="xl"
            className="mt-7 w-full"
            onClick={game.startGame}
          >
            Start game
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Shell>
  );
}