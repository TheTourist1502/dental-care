'use client'
import { Icon } from '@iconify/react'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { bookingSchema, normalizePhone } from '@/lib/validations'
import { CLINIC, TIME_SLOTS, buildWhatsAppUrl } from '@/lib/clinic'
import Calendar, { formatDisplayDate } from '@/app/components/ui/calendar'
import Dropdown from '@/app/components/ui/dropdown'
import styles from './index.module.css'

// Cloudflare's official published TEST site key — always passes, safe for
// dev. Get a real one free at https://dash.cloudflare.com/?to=/:account/turnstile
// and set NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env.local before going live.
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

const WHY_ITEMS = [
  { icon: 'solar:clock-circle-linear', title: 'Minimal Wait Times', desc: 'Punctual appointments — your time is respected.' },
  { icon: 'solar:calendar-minimalistic-linear', title: 'Evening & Weekend Slots', desc: 'Flexible hours to fit your busy schedule.' },
  { icon: 'solar:chat-round-dots-linear', title: 'WhatsApp Confirmations', desc: 'We confirm your slot on call or WhatsApp within an hour.' },
  { icon: 'solar:shield-check-linear', title: 'No Advance Payment', desc: 'Pay at the clinic after your visit — book risk-free.' },
]

type Form = { name: string; phone: string; email: string; date: string; timeSlot: string }
const INITIAL: Form = { name: '', phone: '', email: '', date: '', timeSlot: '' }
type Status = 'idle' | 'sending' | 'sent' | 'fallback'

function slotStart(slot: string): { h: number; m: number } {
  const match = slot.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return { h: 10, m: 0 }
  let h = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'PM') h += 12
  return { h, m: Number(match[2]) }
}

function downloadIcs(form: Form) {
  const { h, m } = slotStart(form.timeSlot)
  const [y, mo, d] = form.date.split('-').map(Number)
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = (dt: Date) =>
    `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`
  const start = new Date(y, mo - 1, d, h, m)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dr Maria Dental//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@drmaria-dental-clinic.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Dental appointment — ${CLINIC.shortName}`,
    `LOCATION:${CLINIC.address}`,
    `DESCRIPTION:Requested slot ${form.timeSlot}. The clinic will confirm on ${CLINIC.phoneDisplay}.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'dr-maria-appointment.ics'
  a.click()
  URL.revokeObjectURL(url)
}

export default function AppointmentForm() {
  const [form, setForm] = useState<Form>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [patientEmailSent, setPatientEmailSent] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState('')
  const captchaRef = useRef<TurnstileInstance>(null)

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const minDate = new Date()
  minDate.setHours(0, 0, 0, 0)
  const maxDate = new Date(minDate)
  maxDate.setMonth(maxDate.getMonth() + 2)

  function set(field: keyof Form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function whatsAppMessage() {
    return (
      `New Appointment Request\n\n` +
      `Name: ${form.name}\n` +
      `Phone: +91 ${normalizePhone(form.phone)}\n` +
      (form.email ? `Email: ${form.email}\n` : '') +
      `Date: ${formatDisplayDate(form.date)}\n` +
      `Time: ${form.timeSlot}`
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = bookingSchema.safeParse(form)
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      const mapped: typeof errors = {}
      for (const [k, v] of Object.entries(flat)) {
        mapped[k as keyof Form] = (v as string[])[0]
      }
      setErrors(mapped)
      return
    }

    if (!captchaToken) {
      setCaptchaError('Please complete the captcha')
      return
    }
    setCaptchaError('')

    setStatus('sending')

    const templateParams = {
      // Shared
      patient_name: form.name,
      patient_phone: `+91 ${normalizePhone(form.phone)}`,
      patient_email: form.email || 'Not provided',
      to_email: form.email,
      appointment_date: formatDisplayDate(form.date),
      time_slot: form.timeSlot,
      website_url: CLINIC.siteUrl,
      logo_url: `${CLINIC.siteUrl}/images/logo.png`,
      // Admin template only
      doctor_name: CLINIC.doctorName,
      admin_email: CLINIC.email,
      booking_source: 'Website booking form',
      submitted_at: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      }),
      // Patient template only
      clinic_phone: CLINIC.phoneDisplay,
      clinic_address: CLINIC.address,
    }

    try {
      // Sending happens server-side (Cloudflare Function) so the EmailJS
      // private key and Turnstile secret never reach the browser, and the
      // function can rate-limit by IP before spending a send.
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, captchaToken, templateParams }),
      })
      const data: { success: boolean; sentTo?: 'patient' | 'admin' } = await res.json()
      if (data.success) {
        setPatientEmailSent(data.sentTo === 'patient')
        setStatus('sent')
      } else {
        setStatus('fallback')
      }
    } catch {
      setStatus('fallback')
    } finally {
      captchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  function reset() {
    setForm(INITIAL)
    setErrors({})
    setStatus('idle')
    setPatientEmailSent(false)
    setCaptchaToken(null)
    setCaptchaError('')
    captchaRef.current?.reset()
  }

  const submitted = status === 'sent' || status === 'fallback'

  return (
    <section className={styles.section} id="appointment" ref={sectionRef}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.tagline}>Book an Appointment</span>
          <h2 className={styles.heading}>
            Reserve Your <br />
            <span className="accent">Slot.</span>
          </h2>
          <p className={styles.sub}>
            Book in under a minute — just your name, number and a time that
            suits you. We&apos;ll confirm on call or WhatsApp within an hour.
          </p>

          <div className={styles.whyList}>
            {WHY_ITEMS.map((w, i) => (
              <motion.div
                key={w.title}
                className={styles.whyItem}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              >
                <div className={styles.whyIcon}>
                  <Icon icon={w.icon} width={24} height={24} />
                </div>
                <div>
                  <h4 className={styles.whyTitle}>{w.title}</h4>
                  <p className={styles.whyDesc}>{w.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.formWrap}
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        >
          {submitted ? (
            <div className={styles.confirmPanel} role="status">
              <div className={styles.confirmIcon}>
                <Icon
                  icon={status === 'sent' ? 'solar:check-circle-bold' : 'solar:chat-round-dots-bold'}
                  width={44}
                  height={44}
                />
              </div>
              <h3 className={styles.confirmTitle}>
                {status === 'sent' ? 'Request received!' : 'One more tap'}
              </h3>
              <p className={styles.confirmText}>
                {status === 'sent'
                  ? `Thanks ${form.name.split(' ')[0]} — we've got your request for ${formatDisplayDate(form.date)}, ${form.timeSlot}. We'll confirm on ${'+91 ' + normalizePhone(form.phone)} shortly.` +
                    (patientEmailSent ? ` A confirmation has also been emailed to ${form.email}.` : '')
                  : 'We could not send your request automatically. Send it on WhatsApp instead — it takes one tap and your details are pre-filled.'}
              </p>
              <div className={styles.confirmActions}>
                <a
                  href={buildWhatsAppUrl(whatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.confirmWhatsApp}
                >
                  <Icon icon="ic:baseline-whatsapp" width={20} height={20} />
                  {status === 'sent' ? 'Chat with us on WhatsApp' : 'Send via WhatsApp'}
                </a>
                {status === 'sent' && (
                  <button type="button" className={styles.confirmGhost} onClick={() => downloadIcs(form)}>
                    <Icon icon="solar:calendar-add-linear" width={18} height={18} />
                    Add to calendar
                  </button>
                )}
                <button type="button" className={styles.confirmLink} onClick={reset}>
                  Book another appointment
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <Field label="Full Name" htmlFor="bk-name" error={errors.name}>
                <input
                  id="bk-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={errors.name ? styles.inputError : styles.input}
                />
              </Field>

              <Field label="Phone Number" htmlFor="bk-phone" error={errors.phone}>
                <input
                  id="bk-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={errors.phone ? styles.inputError : styles.input}
                />
              </Field>

              <Field label="Email (optional)" htmlFor="bk-email" error={errors.email}>
                <input
                  id="bk-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="For an email confirmation too"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={errors.email ? styles.inputError : styles.input}
                />
              </Field>

              <div className={styles.row}>
                <Field label="Preferred Date" htmlFor="bk-date" error={errors.date}>
                  <Calendar
                    id="bk-date"
                    value={form.date}
                    onChange={(iso) => set('date', iso)}
                    placeholder="Pick a date"
                    minDate={minDate}
                    maxDate={maxDate}
                    invalid={Boolean(errors.date)}
                  />
                </Field>
                <Field label="Time Slot" htmlFor="bk-slot" error={errors.timeSlot}>
                  <Dropdown
                    id="bk-slot"
                    options={TIME_SLOTS}
                    value={form.timeSlot}
                    onChange={(slot) => set('timeSlot', slot)}
                    placeholder="Choose a slot"
                    invalid={Boolean(errors.timeSlot)}
                  />
                </Field>
              </div>

              <div className={styles.captchaWrap}>
                <Turnstile
                  ref={captchaRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(token) => {
                    setCaptchaToken(token)
                    setCaptchaError('')
                  }}
                  onExpire={() => setCaptchaToken(null)}
                />
                {captchaError && <span className={styles.errorText}>{captchaError}</span>}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Booking…' : 'Book Appointment'}
              </button>

              <p className={styles.privacyNote}>
                No account, no advance payment. Your details go directly to the
                clinic and are never stored on this website.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      <span className={styles.errorText} aria-live="polite">
        {error}
      </span>
    </div>
  )
}
