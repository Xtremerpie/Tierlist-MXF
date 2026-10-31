import { db } from "./db";
export async function getStats(): Promise<[string, number][]> {
  try {
    const d = db();
    const [p, g, r, h] = await Promise.all([
      d.from("players").select("*", { count: "exact", head: true }),
      d.from("gamemodes").select("*", { count: "exact", head: true }),
      d.from("rankings").select("player_id").neq("tier_code", "Unranked"),
      d.from("tier_history").select("*", { count: "exact", head: true }),
    ]);
    return [["Players", p.count ?? 0], ["Gamemodes", g.count ?? 0], ["Ranked players", new Set((r.data ?? []).map((x: any) => x.player_id)).size], ["Tier evaluations", h.count ?? 0]];
  } catch { return [["Players", 0], ["Gamemodes", 0], ["Ranked players", 0], ["Tier evaluations", 0]]; }
}
