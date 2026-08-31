// Standalone booking API for the Dr Maria Dental site.
// One Cloudflare Worker, one route: POST /api/book.
//
//   1. Rate limit by IP (KV)
//   2. Verify Cloudflare Turnstile server-side
//   3. Persist the booking (D1)
//   4. Ping the clinic on Telegram (best effort)
//
// Patient-facing confirmation is handled on the site itself with a
// wa.me deep link — no WhatsApp API, no phone number to register here.
//
// Local typings only (no @cloudflare/workers-types) to keep the file
// self-contained.

interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>
}

interface D1Database {
  prepare(query: string): D1PreparedStatement
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  run(): Promise<unknown>
}

interface Env {
  RATE_LIMIT_KV: KVNamespace
  DB: D1Database
  ALLOWED_ORIGINS: string
  TURNSTILE_SECRET: string
  TELEGRAM_BOT_TOKEN: string
  TELEGRAM_CHAT_ID: string
}

const MAX_REQUESTS_PER_WINDOW = 5
const WINDOW_SECONDS = 60 * 60 // 1 hour per IP

function corsHeaders(origin: string, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  const match = allowed.includes(origin) ? origin : allowed[0]
  return {
    'Access-Control-Allow-Origin': match,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function json(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

async function notifyClinic(env: Env, text: string): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
  })
  return res.ok
}

async function handleBook(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  let body: { captchaToken?: string; templateParams?: Record<string, string> }
  try {
    body = await request.json()
  } catch {
    return json({ success: false, message: 'Invalid request body' }, 400, cors)
  }

  const { captchaToken, templateParams } = body
  if (!captchaToken || !templateParams) {
    return json({ success: false, message: 'Missing captcha or booking details' }, 400, cors)
  }

  const p = templateParams
  if (!p.patient_name || !p.patient_phone || !p.appointment_date || !p.time_slot) {
    return json({ success: false, message: 'Missing booking fields' }, 400, cors)
  }
  if (!/^\d{10}$/.test(p.patient_phone)) {
    return json({ success: false, message: 'Phone must be exactly 10 digits' }, 400, cors)
  }
  if (p.patient_name.length > 40) {
    return json({ success: false, message: 'Name too long' }, 400, cors)
  }

  // 1. Rate limit by IP — reserve the slot immediately so failed attempts still count.
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const rateLimitKey = `ratelimit:${ip}`
  const existing = await env.RATE_LIMIT_KV.get(rateLimitKey)
  const count = existing ? parseInt(existing, 10) : 0
  if (count >= MAX_REQUESTS_PER_WINDOW) {
    return json(
      { success: false, message: 'Too many booking attempts. Please try again later.' },
      429,
      cors
    )
  }
  await env.RATE_LIMIT_KV.put(rateLimitKey, String(count + 1), { expirationTtl: WINDOW_SECONDS })

  // 2. Verify the human server-side.
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: captchaToken }),
  })
  const verifyData = (await verifyRes.json()) as { success: boolean; 'error-codes'?: string[] }
  if (!verifyData.success) {
    return json(
      { success: false, message: 'Captcha verification failed', errors: verifyData['error-codes'] || [] },
      400,
      cors
    )
  }

  // 3. Persist — this is the booking record.
  try {
    await env.DB.prepare(
      'INSERT INTO bookings (patient_name, mobile_number, booking_date, time_slot) VALUES (?, ?, ?, ?)'
    )
      .bind(p.patient_name, p.patient_phone, p.appointment_date, p.time_slot)
      .run()
  } catch {
    return json({ success: false, message: 'Could not save booking' }, 502, cors)
  }

  // 4. Ping the clinic. Best effort — a failed ping must not fail the booking.
  const notified = await notifyClinic(
    env,
    `New booking request\n` +
      `Name: ${p.patient_name}\n` +
      `Phone: +91 ${p.patient_phone}\n` +
      `Date: ${p.appointment_date}\n` +
      `Time: ${p.time_slot}`
  ).catch(() => false)

  return json({ success: true, notified }, 200, cors)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || ''
    const cors = corsHeaders(origin, env)
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
    if (url.pathname === '/api/book' && request.method === 'POST') {
      return handleBook(request, env, cors)
    }
    return json({ success: false, message: 'Not found' }, 404, cors)
  },
}
