# dental-care

Monorepo. Two independently deployed packages.

| Path | What | Deploy |
|------|------|--------|
| [`dental-care-fe/`](dental-care-fe/) | Next.js static site (Dr Maria Dental) | Cloudflare (static export in `out/`) |
| [`dental-care-be/`](dental-care-be/) | Booking API — Cloudflare Worker (Turnstile + D1 + Telegram) | `cd dental-care-be && npm run deploy` |

Each folder has its own `package.json`, `wrangler.jsonc`, and README. No root
workspace tooling — `cd` into the one you're working on.

The site calls the API at `process.env.NEXT_PUBLIC_API_URL` + `/api/book`.
