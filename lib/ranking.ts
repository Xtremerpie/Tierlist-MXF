import { db } from "./db";
export type Entry = { username: string; points: number; best: number; region?: string | null; updated: string; tiers: { mode: string; tier: string }[] };

// "All gamemodes" score = sum of the configurable points of each tier (tiers.points), not raw tier numbers.
export async function getBoard(mode = "all", q?: string, tier?: string): Promise<Entry[]> {
  const { data, error } = await db().from("rankings")
    .select("tier_code,region,updated_at,gamemodes(slug,name),players(username),tiers(sort_order,points)");
  if (error || !data) return [];
  const map = new Map<string, Entry>();
  for (const r of data as any[]) {
    if (r.tier_code === "Unranked" || (mode !== "all" && r.gamemodes.slug !== mode)) continue;
    const u: string = r.players.username;
    const e: Entry = map.get(u) ?? { username: u, points: 0, best: 999, region: r.region, updated: r.updated_at, tiers: [] };
    e.points += r.tiers.points; e.best = Math.min(e.best, r.tiers.sort_order);
    e.region = e.region ?? r.region;
    if (r.updated_at > e.updated) e.updated = r.updated_at;
    e.tiers.push({ mode: r.gamemodes.name, tier: r.tier_code });
    map.set(u, e);
  }
  let list = [...map.values()];
  if (q) list = list.filter((e) => e.username.toLowerCase().includes(q.toLowerCase()));
  if (tier) list = list.filter((e) => e.tiers.some((t) => t.tier === tier));
  return list.sort((a, b) => (mode === "all" ? b.points - a.points : a.best - b.best || b.points - a.points));
}
