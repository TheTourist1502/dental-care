'use client'
import { Icon } from '@iconify/react'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './index.module.css'

const SERVICES = [
  {
    icon: 'solar:medical-kit-linear',
    title: 'General Dentistry',
    desc: 'Routine checkups, cleaning, fillings, and preventive care to keep your smile healthy year-round.',
    tag: 'Most Popular',
  },
  {
    icon: 'solar:magic-stick-3-linear',
    title: 'Cosmetic Dentistry',
    desc: 'Teeth whitening, veneers, bonding — transform your smile with our advanced cosmetic treatments.',
    tag: null,
  },
  {
    icon: 'solar:screw-driver-linear',
    title: 'Dental Implants',
    desc: 'Permanent tooth replacement with titanium implants. Natural look, natural feel, lasting results.',
    tag: 'Speciality',
  },
  {
    icon: 'solar:align-bottom-linear',
    title: 'Orthodontics',
    desc: 'Traditional braces and clear aligners to correct misalignment and deliver a perfectly straight smile.',
    tag: null,
  },
  {
    icon: 'solar:user-rounded-linear',
    title: 'Pediatric Dentistry',
    desc: 'Child-friendly dental care in a warm, welcoming environment. Building healthy habits from day one.',
    tag: null,
  },
  {
    icon: 'solar:health-linear',
    title: 'Root Canal Therapy',
    desc: 'Pain-free endodontic treatment using the latest rotary systems and magnification technology.',
    tag: null,
  },
]

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="services">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tagline}>What We Offer</span>
          <h2 className={styles.heading}>
            Premium Dental <br />
            <span className="accent">Specialities.</span>
          </h2>
          <p className={styles.sub}>
            Kolkata&apos;s leading multi-speciality clinic offering comprehensive dental care 
            tailored for every stage of your life — with state-of-the-art technology.
          </p>
        </div>

        <div className={styles.grid} ref={ref}>
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={styles.icon}>
                <Icon icon={s.icon} width={40} height={40} />
              </div>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.desc}>{s.desc}</p>
              {s.tag && <span className={styles.tag}>{s.tag}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
