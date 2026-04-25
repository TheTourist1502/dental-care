'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './index.module.css'

const TESTIMONIALS = [
  {
    stars: 5,
    text: 'Dr. Maria is absolutely wonderful. My dental anxiety completely vanished after my first visit. The clinic is spotless and the staff is incredibly warm.',
    initials: 'RS',
    name: 'Riya Sharma',
    since: 'Patient since 2021',
  },
  {
    stars: 5,
    text: 'Got my implants done here. The procedure was virtually painless and Dr. Maria explained every step. Highly recommend for anyone needing implants.',
    initials: 'AK',
    name: 'Arjun Kumar',
    since: 'Patient since 2020',
  },
  {
    stars: 5,
    text: 'My kids actually look forward to their dental visits now! The pediatric area is beautifully designed and Dr. Maria is brilliant with children.',
    initials: 'PM',
    name: 'Priya Mehta',
    since: 'Patient since 2022',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.container}>
        <span className={styles.tagline}>Patient Stories</span>
        <h2 className={styles.heading}>What Our Patients Say</h2>

        <div className={styles.grid} ref={ref}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={styles.stars}>{'★'.repeat(t.stars)}</div>
              <p className={styles.text}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.initials}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.since}>{t.since}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
