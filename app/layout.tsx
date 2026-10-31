import "./globals.css";
import Link from "next/link";
import { Chakra_Petch, Manrope } from "next/font/google";
import { DISCORD_URL, SITE_NAME } from "@/lib/site";
const display = Chakra_Petch({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
export const metadata = { title: SITE_NAME, description: "Minecraft PvP tier rankings." };
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen scroll-smooth">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-xl font-bold tracking-wide">Tierlist <span className="text-blood">MXF</span></Link>
          <nav className="flex gap-6 text-sm text-zinc-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/tierlist" className="hover:text-white">Tierlist</Link>
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hover:text-white">Discord</a>
          </nav>
        </header>
        {children}
        <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500">{SITE_NAME}. Not affiliated with Mojang or Microsoft.</footer>
      </body>
    </html>
  );
}
