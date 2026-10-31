export default function TierBadge({ tier, label }: { tier: string; label?: string }) {
  const high = tier.startsWith("HT");
  const cls = tier === "Unranked" ? "border-zinc-700 text-zinc-400"
    : high ? "border-blood/60 bg-blood/10 text-rose-200" : "border-violet/60 bg-violet/10 text-violet-200";
  return <span title={label} className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-sm font-display font-semibold ${cls}`}>{tier}{label && <span className="text-xs font-normal opacity-70">{label}</span>}</span>;
}
