import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { characters } from "@/lib/characters";
import Skin from "@/components/Skin";
import TierBadge from "@/components/TierBadge";
export const dynamic = "force-dynamic";

export default async function Player({ params }: { params: { name: string } }) {
  const d = db();
  const { data: p } = await d.from("players").select("*").ilike("username", decodeURIComponent(params.name)).maybeSingle();
  if (!p) notFound();
  const [{ data: ranks }, { data: hist }] = await Promise.all([
    d.from("rankings").select("tier_code,region,updated_at,gamemodes(name)").eq("player_id", p.id),
    d.from("tier_history").select("old_tier,new_tier,changed_at,gamemodes(name)").eq("player_id", p.id).order("changed_at", { ascending: false }).limit(50),
  ]);
  const skin = characters.find((c) => c.username.toLowerCase() === p.username.toLowerCase())?.skin ?? null;
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 md:grid-cols-[220px_1fr]">
      <div><Skin file={skin} username={p.username} scale={9} /></div>
      <div>
        <h1 className="font-display text-4xl font-bold">{p.username}</h1>
        {p.uuid && <p className="mt-1 text-xs text-zinc-500">{p.uuid}</p>}
        {p.discord && <p className="mt-1 text-sm text-zinc-400">Discord: {p.discord}</p>}
        <h2 className="mt-8 font-display text-xl font-bold">Current rankings</h2>
        <div className="mt-3 flex flex-wrap gap-2">{(ranks ?? []).map((r: any) => <TierBadge key={r.gamemodes.name} tier={r.tier_code} label={r.gamemodes.name} />)}</div>
        <h2 className="mt-8 font-display text-xl font-bold">History</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {(hist ?? []).length === 0 && <li className="text-zinc-500">No tier changes recorded yet.</li>}
          {(hist ?? []).map((h: any, i) => <li key={i} className="text-zinc-300">{new Date(h.changed_at).toLocaleDateString()} · {h.gamemodes.name}: {h.old_tier ?? "unranked"} to {h.new_tier ?? "removed"}</li>)}
        </ul>
      </div>
    </main>
  );
}
