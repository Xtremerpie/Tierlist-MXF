# Tierlist MXF
1. Create a Supabase project, run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill it in. `npm install && npm run dev`.
3. Deploy to Vercel with the same env vars.

## Bot API (header `x-bot-key: $BOT_API_KEY`)
- `POST /api/bot/players/add` `{username, gamemode:"crystal", tier:"HT3", region?, uuid?, discord?}` (also changes tiers)
- `POST /api/bot/players/remove` `{username, gamemode}`
- `POST /api/bot/gamemodes/add` `{name}`

Characters and skins: edit `lib/characters.ts`. Tier order and points live in the `tiers` table.
