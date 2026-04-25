'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

const QUALS = [
  'BDS, Maulana Azad Institute of Dental Sciences',
  'MDS — Prosthodontics & Crown/Bridge',
  'Fellowship in Oral Implantology, Singapore',
  'Member, Indian Dental Association',
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="about" ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.imgCol}
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div 
            className={styles.doctorImg}
            style={{ 
              backgroundImage: `url('/images/doctor.webp')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '500px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--soft-border)'
            }}
          />
          <div className={styles.expBadge}>
            <span className={styles.expNum}>15</span>
            <span className={styles.expLabel}>Years Experience</span>
          </div>
        </motion.div>

        <motion.div
          className={styles.textCol}
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        >
          <span className={styles.tagline}>About Dr. Maria</span>
          <h2 className={styles.heading}>
            Dedicated to Excellence <br />
            <span className="accent">in Dental Care</span>
          </h2>
          <p className={styles.para}>
            Dr. Maria Fernandez completed her BDS from the prestigious Maulana
            Azad Institute and pursued her MDS in Prosthodontics. With over 15
            years of clinical experience, she has treated thousands of patients
            with compassion and precision.
          </p>
          <p className={styles.para}>
            She continuously updates her skills through international workshops
            and is a member of the Indian Dental Association.
          </p>

          <ul className={styles.quals}>
            {QUALS.map((q, i) => (
              <motion.li
                key={q}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
              >
                <Icon icon="solar:check-read-linear" className={styles.checkIcon} />
                {q}
              </motion.li>
            ))}
          </ul>

          <a href="#appointment" className={styles.btnPrimary}>
            Book a Consultation
          </a>
        </motion.div>
      </div>
    </section>
  )
}
