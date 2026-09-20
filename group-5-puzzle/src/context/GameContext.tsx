"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { pickWord, shuffleLetters } from "@/lib/words";
import { registerPlayer, finishGame, type FinishGameResponse } from "@/lib/api";

export type Screen =
  | "loading"
  | "intro"
  | "name"
  | "home"
  | "briefing"
  | "instructions"
  | "game"
  | "final"
  | "epilogue"
  | "results"
  | "leaderboard";

type GameState = {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  registering: boolean;
  registerError: string | null;
  registerPlayerAndContinue: (name: string, email: string) => Promise<void>;
  level: number;
  unlocked: string[];
  word: string;
  scrambled: string[];
  elapsed: number;
  running: boolean;
  muted: boolean;
  lastResult: FinishGameResponse | null;
  startGame: () => void;
  finishLevel: () => void;
  advanceLevel: () => void;
  solve: () => void;
  playAgain: () => void;
  goHome: () => void;
  toggleMuted: () => void;
  playSound: (type: "click" | "snap" | "error" | "success") => void;
};

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("loading");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<FinishGameResponse | null>(null);
  const [level, setLevel] = useState(1);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [puzzle, setPuzzle] = useState<{ word: string; scrambled: string[] }>({
    word: "",
    scrambled: [],
  });
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const startedAt = useRef(0);
  const audio = useRef<AudioContext | null>(null);
  const bgMusic = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const track = new Audio("/audio/audio.mp3");
    track.loop = true;
    track.volume = 0.2;
    track.muted = muted;
    bgMusic.current = track;
    const tryPlay = () => {
      track.play().catch(() => {
        /* blocked until user gesture */
      });
    };
    tryPlay();
    document.addEventListener("click", tryPlay);
    document.addEventListener("keydown", tryPlay);
    return () => {
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("keydown", tryPlay);
      track.pause();
      bgMusic.current = null;
    };
  }, [muted]);
  useEffect(() => {
    if (bgMusic.current) bgMusic.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const id = window.setTimeout(() => setScreen("intro"), 1700);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)),
      250,
    );
    return () => window.clearInterval(id);
  }, [running]);

  const playSound = useCallback(
    (type: "click" | "snap" | "error" | "success") => {
      if (muted) return;
      const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioCtor) return;
      audio.current ??= new AudioCtor();
      const ctx = audio.current;
      const now = ctx.currentTime;
      const notes =
        type === "success"
          ? [523, 659, 784]
          : [type === "snap" ? 660 : type === "error" ? 170 : 350];
      notes.forEach((frequency, index) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type === "error" ? "sawtooth" : "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, now + index * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.09, now + index * 0.8 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.8 + 0.14);
        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(now + index * 0.8);
        oscillator.stop(now + index * 0.8 + 0.16);
      });
    },
    [muted],
  );

  const registerPlayerAndContinue = useCallback(
    async (playerName: string, playerEmail: string) => {
      setRegistering(true);
      setRegisterError(null);
      try {
        const { id } = await registerPlayer(playerName, playerEmail);
        setPlayerId(id);
        setName(playerName);
        setEmail(playerEmail);
        playSound("click");
        setScreen("home");
      } catch (err) {
        setRegisterError(
          err instanceof Error ? err.message : "Something went wrong. Try again.",
        );
        playSound("error");
      } finally {
        setRegistering(false);
      }
    },
    [playSound],
  );

  const startGame = useCallback(() => {
    const word = pickWord(puzzle.word);
    setPuzzle({ word, scrambled: shuffleLetters(word.split(""), word) });
    setLevel(1);
    setUnlocked([]);
    setElapsed(0);
    setLastResult(null);
    startedAt.current = Date.now();
    setRunning(true);
    setScreen("game");
    playSound("click");
  }, [playSound, puzzle.word]);

  const finishLevel = useCallback(() => {
    const letter = puzzle.scrambled[level - 1];
    if (letter) {
      setUnlocked((current) =>
        current.length >= level ? current : [...current, letter],
      );
    }
    playSound("success");
  }, [level, puzzle.scrambled, playSound]);

  const advanceLevel = useCallback(() => {
    if (level < 5) setLevel((current) => current + 1);
    else setScreen("final");
  }, [level]);

  const solve = useCallback(() => {
  setRunning(false);
  setScreen("epilogue");
  playSound("success");
  if (playerId) {
    finishGame(playerId, startedAt.current)   // ← was: new Date(startedAt.current).toISOString()
      .then((result) => setLastResult(result))
      .catch(() => {
        setLastResult({
          name,
          time: elapsed,
          date: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          }),
          attempt: 1,
          improved: false,
        });
      });
  }
}, [elapsed, name, playSound, playerId]);

  const playAgain = useCallback(() => {
    setScreen("instructions");
    setLevel(1);
    setUnlocked([]);
    setElapsed(0);
    setLastResult(null);
    setRunning(false);
  }, []);

  const goHome = useCallback(() => {
    setRunning(false);
    setLevel(1);
    setUnlocked([]);
    setElapsed(0);
    setScreen("home");
  }, []);

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      name,
      setName,
      email,
      setEmail,
      registering,
      registerError,
      registerPlayerAndContinue,
      level,
      unlocked,
      word: puzzle.word,
      scrambled: puzzle.scrambled,
      elapsed,
      running,
      muted,
      lastResult,
      startGame,
      finishLevel,
      advanceLevel,
      solve,
      playAgain,
      goHome,
      toggleMuted: () => setMuted((v) => !v),
      playSound,
    }),
    [
      screen,
      name,
      email,
      registering,
      registerError,
      registerPlayerAndContinue,
      level,
      unlocked,
      puzzle,
      elapsed,
      running,
      muted,
      lastResult,
      startGame,
      finishLevel,
      advanceLevel,
      solve,
      playAgain,
      goHome,
      playSound,
    ],
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error("useGame must be used inside GameProvider");
  return value;
}