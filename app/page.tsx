import Link from "next/link";
import { Trophy, MessageCircle } from "lucide-react";
import CharacterRow from "@/components/CharacterRow";
import { DISCORD_URL, SITE_NAME } from "@/lib/site";

export default function Home() {
  return (
    <main className="glow">
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <p className="font-display text-lg text-blood">{SITE_NAME}</p>
        <h1 className="mt-2 font-display text-6xl font-bold leading-[0.95] sm:text-8xl">THE COMPETITIVE<br />EDGE.</h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-300">{SITE_NAME} ranks Minecraft PvP players by tier in every gamemode. Staff update rankings through the Discord bot and they appear here instantly.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tierlist" className="inline-flex items-center gap-2 rounded bg-blood px-5 py-3 font-semibold hover:bg-rose-500"><Trophy size={18} />Open the tier list</Link>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-violet px-5 py-3 font-semibold hover:bg-violet/20"><MessageCircle size={18} />Join Discord</a>
        </div>
        <div className="mt-20"><CharacterRow /></div>
      </section>
    </main>
  );
}
