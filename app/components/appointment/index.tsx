'use client'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { appointmentSchema, type AppointmentInput } from '@/lib/validations'
import styles from './index.module.css'

const SERVICES = [
  'General Checkup',
  'Teeth Cleaning',
  'Dental Implants',
  'Cosmetic Dentistry',
  'Orthodontics',
  'Root Canal',
  'Pediatric Dentistry',
]

const WHY_ITEMS = [
  { icon: 'solar:clock-circle-linear', title: 'Minimal Wait Times', desc: 'Punctual appointments — your time is respected.' },
  { icon: 'solar:card-2-linear', title: 'All Insurance Accepted', desc: 'We work with all major insurance providers.' },
  { icon: 'solar:calendar-minimalistic-linear', title: 'Evening & Weekend Slots', desc: 'Flexible hours to fit your busy schedule.' },
  { icon: 'solar:chat-round-dots-linear', title: 'WhatsApp Confirmations', desc: 'Instant booking confirmations on WhatsApp.' },
]

type FormState = Omit<AppointmentInput, 'service'> & { service: string }

const INITIAL: FormState = {
  name: '',
  phone: '',
  email: '',
  service: '',
  preferred_date: '',
  message: '',
}

export default function AppointmentForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverMsg, setServerMsg] = useState('')

  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const today = new Date().toISOString().split('T')[0]

  function set(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit() {
    const parsed = appointmentSchema.safeParse(form)
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      const mapped: typeof errors = {}
      for (const [k, v] of Object.entries(flat)) {
        mapped[k as keyof FormState] = (v as string[])[0]
      }
      setErrors(mapped)
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setServerMsg(data.message)
        setForm(INITIAL)
        setErrors({})
      } else {
        setStatus('error')
        setServerMsg(data.message || 'Something went wrong.')
        if (data.errors) setErrors(data.errors)
      }
    } catch {
      setStatus('error')
      setServerMsg('Network error. Please try again.')
    }
  }

  return (
    <section className={styles.section} id="appointment" ref={sectionRef}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.tagline}>Get in Touch</span>
          <h2 className={styles.heading}>
            Book Your <br />
            <span className="accent">Consultation.</span>
          </h2>
          <p className={styles.sub}>
            Schedule your visit in under 2 minutes. Our team will confirm your
            slot within 1 hour.
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
          <div className={styles.row}>
            <Field label="Full Name" error={errors.name}>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className={errors.name ? styles.inputError : styles.input}
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input
                type="tel"
                placeholder="+91"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className={errors.phone ? styles.inputError : styles.input}
              />
            </Field>
          </div>

          <Field label="Email Address" error={errors.email}>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={errors.email ? styles.inputError : styles.input}
            />
          </Field>

          <div className={styles.row}>
            <Field label="Service" error={errors.service}>
              <select
                value={form.service}
                onChange={(e) => set('service', e.target.value)}
                className={errors.service ? styles.inputError : styles.input}
              >
                <option value="">Select service</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Preferred Date" error={errors.preferred_date}>
              <input
                type="date"
                min={today}
                value={form.preferred_date}
                onChange={(e) => set('preferred_date', e.target.value)}
                className={errors.preferred_date ? styles.inputError : styles.input}
              />
            </Field>
          </div>

          <Field label="Message (optional)" error={errors.message}>
            <textarea
              placeholder="How can we help?"
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              className={`${errors.message ? styles.inputError : styles.input} ${styles.textarea}`}
            />
          </Field>

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Request Appointment'}
          </button>

          {status === 'success' && (
            <div className={styles.success}>{serverMsg}</div>
          )}
          {status === 'error' && (
            <div className={styles.errorBanner}>{serverMsg}</div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
