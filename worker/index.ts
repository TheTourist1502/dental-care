// Cloudflare Worker entry point. Serves the static Next.js export (via
// the ASSETS binding, pointed at `out/` in wrangler.jsonc) and handles
// POST /api/book itself — this deploy path (Workers Static Assets)
// doesn't support the old Pages Functions `functions/` directory file
// routing, so every request goes through one fetch handler here.
//
// Local typings only (no @cloudflare/workers-types) to avoid clashing
// with the app's own DOM-based tsconfig.
interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>
}

interface Fetcher {
  fetch(request: Request): Promise<Response>
}

interface Env {
  ASSETS: Fetcher
  RATE_LIMIT_KV: KVNamespace
  HCAPTCHA_SECRET: string
  EMAILJS_SERVICE_ID: string
  EMAILJS_PUBLIC_KEY: string
  EMAILJS_PRIVATE_KEY: string
  EMAILJS_ADMIN_TEMPLATE_ID: string
  EMAILJS_PATIENT_TEMPLATE_ID: string
}

const MAX_REQUESTS_PER_WINDOW = 5
const WINDOW_SECONDS = 60 * 60 // 1 hour per IP

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function handleBook(request: Request, env: Env): Promise<Response> {
  let body: {
    email?: string
    captchaToken?: string
    templateParams?: Record<string, string>
  }
  try {
    body = await request.json()
  } catch {
    return json({ success: false, message: 'Invalid request body' }, 400)
  }

  const { email, captchaToken, templateParams } = body

  if (!captchaToken || !templateParams) {
    return json({ success: false, message: 'Missing captcha or booking details' }, 400)
  }

  // 1. Rate limit by IP — check, then reserve the slot immediately so
  // every attempt counts, even ones that fail captcha below.
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const rateLimitKey = `ratelimit:${ip}`
  const existing = await env.RATE_LIMIT_KV.get(rateLimitKey)
  const count = existing ? parseInt(existing, 10) : 0

  if (count >= MAX_REQUESTS_PER_WINDOW) {
    return json(
      { success: false, message: 'Too many booking attempts. Please try again later.' },
      429
    )
  }
  await env.RATE_LIMIT_KV.put(rateLimitKey, String(count + 1), {
    expirationTtl: WINDOW_SECONDS,
  })

  // 2. Verify the human server-side — a client-only captcha widget can't
  // stop someone who calls this endpoint (or EmailJS) directly with a script.
  const verifyRes = await fetch('https://api.hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: env.HCAPTCHA_SECRET, response: captchaToken }),
  })
  const verifyData = (await verifyRes.json()) as { success: boolean }
  if (!verifyData.success) {
    return json({ success: false, message: 'Captcha verification failed' }, 400)
  }

  // 3. Send via EmailJS's REST API server-side, authenticated with the
  // private key so it works regardless of the (still unset) domain
  // restriction on the public key.
  const sendToPatient = Boolean(email)
  const templateId = sendToPatient ? env.EMAILJS_PATIENT_TEMPLATE_ID : env.EMAILJS_ADMIN_TEMPLATE_ID

  const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: env.EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: env.EMAILJS_PUBLIC_KEY,
      accessToken: env.EMAILJS_PRIVATE_KEY,
      template_params: templateParams,
    }),
  })

  if (!emailRes.ok) {
    const text = await emailRes.text()
    return json({ success: false, message: `Email send failed: ${text}` }, 502)
  }

  return json({ success: true, sentTo: sendToPatient ? 'patient' : 'admin' }, 200)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/book' && request.method === 'POST') {
      return handleBook(request, env)
    }
    return env.ASSETS.fetch(request)
  },
}
