import { NextResponse } from "next/server";
export function denyUnlessBot(req: Request) {
  const key = req.headers.get("x-bot-key");
  if (!process.env.BOT_API_KEY || key !== process.env.BOT_API_KEY)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}
