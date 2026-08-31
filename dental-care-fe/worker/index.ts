// Cloudflare Worker entry point. Serves the static Next.js export from the
// ASSETS binding (pointed at `out/` in wrangler.jsonc). Nothing else —
// booking now lives in the separate dental-care-be Worker.

interface Fetcher {
  fetch(request: Request): Promise<Response>
}

export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    return env.ASSETS.fetch(request)
  },
}
