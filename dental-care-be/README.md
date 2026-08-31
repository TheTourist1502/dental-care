# dental-care-api

Booking backend for the Dr Maria Dental site. One Cloudflare Worker.

`POST /api/book` -> rate limit (KV) -> Turnstile verify -> save (D1) -> Telegram ping to the clinic.

Patient confirmation is a `wa.me` deep link on the site itself — no WhatsApp
API here, no phone number to register.

## One-time setup

```bash
npm install
npx wrangler login

# KV (rate limiting)
npx wrangler kv namespace create RATE_LIMIT_KV
#   -> paste id into wrangler.jsonc  kv_namespaces[0].id

# D1 (bookings)
npx wrangler d1 create dental-care-bookings
#   -> paste database_id into wrangler.jsonc  d1_databases[0].database_id
npm run db:schema:local
npm run db:schema:remote

# Edit wrangler.jsonc vars: ALLOWED_ORIGINS

# Secrets
npx wrangler secret put TURNSTILE_SECRET
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

### Telegram bot

1. Open Telegram, message **@BotFather** -> `/newbot` -> name it -> copy the
   token -> that's `TELEGRAM_BOT_TOKEN`.
2. Create a group for booking alerts, add the bot to it (or just DM the bot).
3. Get the chat id: send any message in that chat, then open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and read
   `result[].message.chat.id` (groups are negative, e.g. `-100123...`).
   That's `TELEGRAM_CHAT_ID`.

## Local dev

Create `.env` (gitignored, auto-loaded by `wrangler dev`):

```
TURNSTILE_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

```bash
npm run dev                      # http://localhost:8787/api/book
```

## Smoke test

```bash
curl -X POST http://localhost:8787/api/book \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:3000' \
  -d '{"captchaToken":"XXXX.DUMMY.TOKEN","templateParams":{
        "patient_name":"Test Patient","patient_phone":"+91 98765 43210",
        "appointment_date":"12 Sep 2026","time_slot":"6:00 PM"}}'
```

With the Turnstile **test** secret (`1x0000000000000000000000000000000AA`)
the captcha check passes and you should get `{"success":true,...}`, a row in
D1, and a Telegram message.

## Deploy

```bash
npm run deploy
```

## Read bookings

```bash
npx wrangler d1 execute dental-care-bookings --remote \
  --command "SELECT * FROM bookings ORDER BY id DESC LIMIT 30"
```
