"use client";
import { motion } from "framer-motion";
import Skin from "./Skin";
import { characters } from "@/lib/characters";
export default function CharacterRow() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-10">
      {characters.map((c, i) => (
        <motion.figure key={c.name} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 * i, duration: 0.6, ease: "easeOut" }} className="flex w-44 flex-col items-center text-center">
          <Skin file={c.skin} username={c.username} scale={9} />
          <div className="mt-2 h-2 w-36 rounded-full bg-gradient-to-r from-blood to-violet blur-[2px]" />
          <figcaption className="mt-3">
            <div className="font-display text-xl font-bold">{c.name}</div>
            <div className="text-sm text-zinc-400">{c.role}</div>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
