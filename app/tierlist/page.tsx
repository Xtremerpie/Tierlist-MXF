import Link from "next/link";
import { db } from "@/lib/db";
import { getBoard } from "@/lib/ranking";
import { getStats } from "@/lib/stats";
import TierBadge from "@/components/TierBadge";
export const dynamic = "force-dynamic";
const PAGE = 25;
type SP = { mode?: string; q?: string; tier?: string; page?: string };

export default async function TierlistPage({ searchParams }: { searchParams: SP }) {
  const mode = searchParams.mode || "all";
  const page = Math.max(1, Number(searchParams.page) || 1);
  const d = db();
  const [stats, { data: modes }, { data: tiers }, all] = await Promise.all([
    getStats(),
    d.from("gamemodes").select("slug,name").order("sort_order"),
    d.from("tiers").select("code").order("sort_order"),
    getBoard(mode, searchParams.q, searchParams.tier),
  ]);
  const rows = all.slice((page - 1) * PAGE, page * PAGE);
  const href = (o: Record<string, string>) => {
    const p = new URLSearchParams({ mode, ...(searchParams.q ? { q: searchParams.q } : {}), ...(searchParams.tier ? { tier: searchParams.tier } : {}), ...o });
    return `/tierlist?${p}`;
  };
  const tab = (active: boolean) => `whitespace-nowrap rounded px-3 py-1.5 text-sm ${active ? "bg-blood font-semibold" : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"}`;
  return (
    <main className="mx-auto max-w-6xl px-6 pb-20">
      <h1 className="font-display text-4xl font-bold">Tierlist</h1>
      <div className="mt-4 grid grid-cols-2 gap-px sm:grid-cols-4">
        {stats.map(([l, n]) => <div key={l} className="border-l border-zinc-800 py-2 pl-4"><div className="font-display text-2xl font-bold">{n}</div><div className="text-xs text-zinc-400">{l}</div></div>)}
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        <Link href="/tierlist?mode=all" className={tab(mode === "all")}>All gamemodes</Link>
        {(modes ?? []).map((m) => <Link key={m.slug} href={`/tierlist?mode=${m.slug}`} className={tab(mode === m.slug)}>{m.name}</Link>)}
      </div>
      <form className="mt-4 flex flex-wrap gap-2">
        <input type="hidden" name="mode" value={mode} />
        <input name="q" defaultValue={searchParams.q} placeholder="Search player" className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm" />
        <select name="tier" defaultValue={searchParams.tier ?? ""} className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm">
          <option value="">Any tier</option>{(tiers ?? []).map((t) => <option key={t.code}>{t.code}</option>)}
        </select>
        <button className="rounded bg-violet px-4 py-2 text-sm font-semibold">Apply</button>
      </form>
      {mode === "all" && <p className="mt-3 text-sm text-zinc-500">All gamemodes ranks by points. Each gamemode tier is worth a set number of points (HT1 is worth the most), and a player's points are added up across gamemodes.</p>}
      <div className="mt-5 overflow-x-auto rounded border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 text-zinc-400"><tr><th className="p-3">#</th><th>Player</th><th>Tier</th><th>Region</th><th>Updated</th>{mode === "all" && <th className="pr-3 text-right">Points</th>}</tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-zinc-400">No players match. Try another gamemode or clear the filters.</td></tr>}
            {rows.map((e, i) => (
              <tr key={e.username} className="border-t border-zinc-900 hover:bg-zinc-950">
                <td className="p-3 font-display text-zinc-500">{(page - 1) * PAGE + i + 1}</td>
                <td><Link href={`/player/${e.username}`} className="flex items-center gap-3 font-semibold hover:text-blood">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://mc-heads.net/avatar/${e.username}/28`} alt="" width={28} height={28} className="rounded-sm" />{e.username}</Link></td>
                <td><span className="flex flex-wrap gap-1 py-2">{e.tiers.map((t) => <TierBadge key={t.mode} tier={t.tier} label={t.mode} />)}</span></td>
                <td className="text-zinc-400">{e.region ?? "-"}</td>
                <td className="text-zinc-400">{new Date(e.updated).toLocaleDateString()}</td>
                {mode === "all" && <td className="pr-3 text-right font-display">{e.points}</td>}
              </tr>))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        {page > 1 ? <Link href={href({ page: String(page - 1) })}>Previous</Link> : <span />}
        {page * PAGE < all.length && <Link href={href({ page: String(page + 1) })}>Next</Link>}
      </div>
    </main>
  );
}
