import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { denyUnlessBot } from "@/lib/bot";
// POST {username, gamemode (slug)} removes the player's tier in that gamemode.
export async function POST(req: Request) {
  const deny = denyUnlessBot(req); if (deny) return deny;
  const { username, gamemode } = await req.json();
  const d = db();
  const [{ data: p }, { data: gm }] = await Promise.all([
    d.from("players").select("id").ilike("username", username ?? "").maybeSingle(),
    d.from("gamemodes").select("id").eq("slug", gamemode ?? "").maybeSingle(),
  ]);
  if (!p || !gm) return NextResponse.json({ error: "Player or gamemode not found" }, { status: 404 });
  const { data: old } = await d.from("rankings").select("tier_code").eq("player_id", p.id).eq("gamemode_id", gm.id).maybeSingle();
  if (!old) return NextResponse.json({ error: "Player has no tier in that gamemode" }, { status: 404 });
  await d.from("rankings").delete().eq("player_id", p.id).eq("gamemode_id", gm.id);
  await d.from("tier_history").insert({ player_id: p.id, gamemode_id: gm.id, old_tier: old.tier_code, new_tier: null });
  return NextResponse.json({ ok: true });
}
