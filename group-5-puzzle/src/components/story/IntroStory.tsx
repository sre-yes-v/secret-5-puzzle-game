"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";

type Bubble = { from: "them" | "me"; text: string; time: string };
type Choice = { label: string; next: string };
type ChatStep = { bubble?: Omit<Bubble, "time">; choices?: Choice[]; next?: string };

const NARRATION = "Late one night, your device receives a transmission from a number that no longer exists.";

const SCRIPT: Record<string, ChatStep[]> = {
  start: [
    { bubble: { from: "them", text: "If you're seeing this... we didn't make it out." } },
    { bubble: { from: "them", text: "Restore the files. Find out what we discovered." } },
    { choices: [
        { label: "Who is this?", next: "who" },
        { label: "What files?", next: "files" },
      ] },
  ],
  who: [
    { bubble: { from: "them", text: "Doesn't matter anymore. What matters is what we found." } },
    { bubble: { from: "me", text: "Okay. Tell me." } },
    { next: "reveal1" },
  ],
  files: [
    { bubble: { from: "them", text: "Five images. Corrupted on purpose, before they could delete them." } },
    { bubble: { from: "me", text: "I'm listening." } },
    { next: "reveal1" },
  ],
  reveal1: [
    { bubble: { from: "them", text: "We were on Project NEURO. A system built to predict human decisions from brain activity, emotion, personal data." } },
    { bubble: { from: "them", text: "It could do more than predict. It could nudge. Manipulate. And they wanted to use it on everyone, quietly." } },
    { choices: [
        { label: "How do you know this?", next: "know" },
        { label: "What do you need from me?", next: "need" },
      ] },
  ],
  know: [
    { bubble: { from: "them", text: "We saw it happen. To people who trusted the system with everything." } },
    { bubble: { from: "me", text: "And you couldn't look away." } },
    { next: "reveal2" },
  ],
  need: [
    { bubble: { from: "them", text: "Five images. That's all that's left of the proof." } },
    { bubble: { from: "me", text: "Then that's where I'll start." } },
    { next: "reveal2" },
  ],
  reveal2: [
    { bubble: { from: "them", text: "When we tried to expose it, they erased us. Our research, our identities. Everything." } },
    { bubble: { from: "them", text: "Everything except five encrypted images, hidden before they could reach us." } },
    { choices: [
        { label: "I'm in.", next: "committed" },
        { label: "What happens if I fail?", next: "fear" },
      ] },
  ],
  committed: [
    { bubble: { from: "them", text: "Then hurry. They're still watching this channel." } },
    { next: "final" },
  ],
  fear: [
    { bubble: { from: "them", text: "Then the truth stays buried. And so do we." } },
    { next: "final" },
  ],
  final: [
    { bubble: { from: "them", text: "Restore them. Recover the letters hidden inside." } },
    { bubble: { from: "me", text: "I'll find out what you found." } },
  ],
};

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function Narration({ onDone }: { onDone: () => void }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (revealed >= NARRATION.length) { const id = window.setTimeout(onDone, 2200); return () => window.clearTimeout(id); }
    const id = window.setTimeout(() => setRevealed((n) => n + 1), 55);
    return () => window.clearTimeout(id);
  }, [revealed, onDone]);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px, #fff 3px)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_85%)]" />
      <p className="relative max-w-xl text-center font-display text-lg leading-relaxed text-neutral-300 md:text-2xl">
        {NARRATION.slice(0, revealed)}
        <span className="animate-pulse text-neutral-500">▌</span>
      </p>
    </main>
  );
}

export function IntroStory() {
  const game = useGame();
  const [phase, setPhase] = useState<"narration" | "chat">("narration");
  const [thread, setThread] = useState("start");
  const [shown, setShown] = useState<Bubble[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [choices, setChoices] = useState<Choice[] | null>(null);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "chat") return;
    const steps = SCRIPT[thread] ?? [];
    const step = steps[stepIndex];
    if (!step) { if (thread === "final") setDone(true); return; }
    if (step.next) { setThread(step.next); setStepIndex(0); return; }
    if (step.choices) { setChoices(step.choices); return; }
    if (step.bubble) {
      const b = step.bubble;
      setChoices(null);
      if (b.from === "them") {
        setTyping(true);
        const id = window.setTimeout(() => { setTyping(false); setShown((s) => [...s, { ...b, time: timestamp() }]); setStepIndex((i) => i + 1); }, 1100);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => { setShown((s) => [...s, { ...b, time: timestamp() }]); setStepIndex((i) => i + 1); }, 350);
      return () => window.clearTimeout(id);
    }
  }, [phase, thread, stepIndex]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [shown, typing, choices]);

  const pick = (choice: Choice) => { setShown((s) => [...s, { from: "me", text: choice.label, time: timestamp() }]); setChoices(null); setThread(choice.next); setStepIndex(0); };

  if (phase === "narration") return <Narration onDone={() => setPhase("chat")} />;

  return (
    <main className="relative grid min-h-screen place-items-center bg-neutral-950 px-4 py-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => game.setScreen("name")}
        className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-200"
      >
        Skip intro
      </Button>
      <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-neutral-800 bg-neutral-900/95 px-4 py-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-neutral-800 font-display text-neutral-400">?</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-100">Unknown</p>
            <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Encrypted · number no longer in service
            </p>
          </div>
        </div>
        <div className="flex h-[60vh] max-h-[520px] flex-col gap-2.5 overflow-y-auto bg-neutral-950 px-4 py-5">
          {shown.map((b, i) => (
            <div key={i} className={`animate-fade-in flex flex-col ${b.from === "them" ? "items-start" : "items-end"}`}>
              <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${b.from === "them" ? "rounded-bl-sm bg-neutral-800 text-neutral-100" : "rounded-br-sm bg-emerald-600 text-white"}`}>
                {b.text}
              </div>
              <span className="mt-1 px-1 text-[10px] text-neutral-600">{b.time}{b.from === "me" && " · Delivered"}</span>
            </div>
          ))}
          {typing && (
            <div className="animate-fade-in self-start rounded-2xl rounded-bl-sm bg-neutral-800 px-4 py-3">
              <span className="flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-neutral-500" />
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-neutral-800 bg-neutral-900 px-4 py-3">
          {choices && (
            <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
              {choices.map((c) => (
                <Button key={c.label} variant="outline" size="sm" onClick={() => pick(c)}>{c.label}</Button>
              ))}
            </div>
          )}
          {done && (
            <div className="flex justify-center animate-fade-in">
              <Button variant="investigate" size="lg" onClick={() => game.setScreen("name")}>
                Restore the files<ArrowRight />
              </Button>
            </div>
          )}
          {!choices && !done && (
            <p className="text-center text-xs text-neutral-600">connecting…</p>
          )}
        </div>
      </div>
    </main>
  );
}
