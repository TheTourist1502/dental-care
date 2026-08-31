// Cloudflare Worker entry point. Serves the static Next.js export from the
// ASSETS binding (pointed at `out/` in wrangler.jsonc). Booking lives in the
// separate dental-care-be Worker.
//
// Geo-gate: the clinic only serves India, Bangladesh and Nepal, so every
// other country gets a 403. Cloudflare fills request.cf.country for free.

interface Fetcher {
  fetch(request: Request): Promise<Response>
}

const ALLOWED = new Set(['IN', 'BD', 'NP'])

export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const country = (request as { cf?: { country?: string } }).cf?.country
    // country is undefined in `wrangler dev` and for Cloudflare's own health
    // checks (T1) — allow those through rather than locking dev out.
    if (country && country !== 'T1' && !ALLOWED.has(country)) {
      return new Response(
        'This site is only available in India, Bangladesh and Nepal.',
        { status: 403, headers: { 'content-type': 'text/plain; charset=utf-8' } },
      )
    }
    return env.ASSETS.fetch(request)
  },
}
