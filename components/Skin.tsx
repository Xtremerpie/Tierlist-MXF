"use client";
import { useEffect, useRef } from "react";
// Front view of a 64x64 skin texture (base + overlay layers). Classic 4px arms.
const P = [[8,8,8,8,4,0],[20,20,8,12,4,8],[44,20,4,12,0,8],[36,52,4,12,12,8],[4,20,4,12,4,20],[20,52,4,12,8,20],
  [40,8,8,8,4,0],[20,36,8,12,4,8],[44,36,4,12,0,8],[52,52,4,12,12,8],[4,36,4,12,4,20],[4,52,4,12,8,20]];
export default function Skin({ file, username, scale = 10 }: { file?: string | null; username: string; scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!file || !ref.current) return;
    const img = new Image(); img.src = file;
    img.onload = () => {
      const c = ref.current!.getContext("2d")!; c.imageSmoothingEnabled = false;
      c.clearRect(0, 0, 16 * scale, 32 * scale);
      P.forEach(([sx, sy, w, h, dx, dy]) => c.drawImage(img, sx, sy, w, h, dx * scale, dy * scale, w * scale, h * scale));
    };
  }, [file, scale]);
  if (file) return <canvas ref={ref} width={16 * scale} height={32 * scale} aria-label={`${username} skin`} style={{ imageRendering: "pixelated" }} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`https://mc-heads.net/body/${username}/${32 * scale}`} alt={`${username} skin`} height={32 * scale} className="h-auto" />;
}
