import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { denyUnlessBot } from "@/lib/bot";
// POST {name, slug?} adds a custom gamemode; it appears on the leaderboard automatically.
export async function POST(req: Request) {
  const deny = denyUnlessBot(req); if (deny) return deny;
  const { name, slug } = await req.json();
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  const s = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const { error } = await db().from("gamemodes").insert({ name, slug: s, sort_order: 100 });
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  return NextResponse.json({ ok: true, slug: s });
}
