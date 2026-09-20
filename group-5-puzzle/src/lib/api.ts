export type RegisterPlayerResponse = { id: string };
export type FinishGameResponse = {
  name: string;
  time: number;
  date: string;
  attempt: number;
  improved: boolean;
};
export type LeaderboardEntry = { name: string; email: string; time: number; date: string };

async function parseOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function registerPlayer(name: string, email: string) {
  const res = await fetch("/api/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  return parseOrThrow<RegisterPlayerResponse>(res);
}

export async function finishGame(id: string, startedAt: number) {
  const res = await fetch("/api/players/finish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, startedAt }),
  });
  return parseOrThrow<FinishGameResponse>(res);
}

export async function fetchLeaderboard() {
  const res = await fetch("/api/leaderboard");
  return parseOrThrow<LeaderboardEntry[]>(res);
}