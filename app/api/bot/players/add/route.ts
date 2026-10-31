import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { denyUnlessBot } from "@/lib/bot";
// Adds a player, or changes their tier if they are already ranked in that gamemode.
// POST {username, gamemode (slug), tier (code), region?, uuid?, discord?}  Header: x-bot-key
export async function POST(req: Request) {
  const deny = denyUnlessBot(req); if (deny) return deny;
  const { username, gamemode, tier, region, uuid, discord } = await req.json();
  if (!username || !gamemode || !tier) return NextResponse.json({ error: "username, gamemode and tier are required" }, { status: 400 });
  const d = db();
  const [{ data: gm }, { data: t }] = await Promise.all([
    d.from("gamemodes").select("id").eq("slug", gamemode).maybeSingle(),
    d.from("tiers").select("code").eq("code", tier).maybeSingle(),
  ]);
  if (!gm) return NextResponse.json({ error: `Unknown gamemode: ${gamemode}` }, { status: 404 });
  if (!t) return NextResponse.json({ error: `Unknown tier: ${tier}` }, { status: 404 });
  const { data: p, error } = await d.from("players").upsert({ username, uuid, discord }, { onConflict: "username" }).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data: old } = await d.from("rankings").select("tier_code").eq("player_id", p.id).eq("gamemode_id", gm.id).maybeSingle();
  await d.from("rankings").upsert({ player_id: p.id, gamemode_id: gm.id, tier_code: tier, region, updated_at: new Date().toISOString() }, { onConflict: "player_id,gamemode_id" });
  await d.from("tier_history").insert({ player_id: p.id, gamemode_id: gm.id, old_tier: old?.tier_code ?? null, new_tier: tier });
  return NextResponse.json({ ok: true, previous: old?.tier_code ?? null });
}
