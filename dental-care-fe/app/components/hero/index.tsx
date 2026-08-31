'use client'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
}

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroBg} aria-hidden="true" />

      <div className={styles.content}>
        <motion.div
          className={styles.tagline}
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <Icon icon="solar:verified-check-bold" style={{ color: 'var(--apple-blue)' }} />
          Dr. Maria&apos;s Multi-Speciality Dental Clinic
        </motion.div>

        <motion.h1
          className={styles.heading}
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          animate="show"
        >
          Your Smile Deserves <br />
          <span className={styles.accent}>Expert Care.</span>
        </motion.h1>

        <motion.p
          className={styles.sub}
          variants={fadeUp}
          custom={0.2}
          initial="hidden"
          animate="show"
        >
          Multi-speciality dental care with a gentle touch. Experience precision 
          dentistry at Newtown, Kolkata — conveniently located behind Unitech Gate 2.
        </motion.p>

        <motion.div
          className={styles.btns}
          variants={fadeUp}
          custom={0.3}
          initial="hidden"
          animate="show"
        >
          <a href="#appointment" className={styles.btnPrimary}>
            Book Appointment
          </a>
          <a href="#services" className={styles.btnSecondary}>
            Learn more <Icon icon="solar:alt-arrow-right-linear" />
          </a>
        </motion.div>
      </div>

      <motion.div
        className={styles.visual}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
      >
        <div 
          className={styles.heroImage}
          style={{ 
            backgroundImage: `url('/images/hero.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-xl)'
          }}
        />
      </motion.div>
    </section>
  )
}
