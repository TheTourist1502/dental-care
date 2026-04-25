'use client'
import { Icon } from '@iconify/react'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './index.module.css'

const CONTACT = [
  { icon: 'solar:map-point-linear', title: 'Address', detail: 'Laskarati Bazar, Baligori Rd, Newtown\nKolkata, West Bengal 700156\n(Behind Unitech Gate 2)' },
  { icon: 'solar:phone-linear', title: 'Phone', detail: '+91 81021 75261 (Call / WhatsApp)' },
  { icon: 'solar:clock-circle-linear', title: 'Hours', detail: 'Mon–Tue: 4:00 PM – 9:00 PM\nWed–Sun: 9:00 AM – 2:00 PM, 5:00 PM – 9:00 PM' },
  { icon: 'solar:letter-linear', title: 'Email', detail: 'contact@drmariadental.in' },
]

const MAPS_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7368.2494!2d88.4834423!3d22.5761589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a020b6ce769f3d5%3A0x1448ee176a9d3c05!2sDr%20Maria\'s%20Multi-speciality%20Dental%20Clinic%2C%20Behind%20Unitech%20gate2!5e0!3m2!1sen!2sin!4v1714030403040!5m2!1sen!2sin'

export default function Location() {
  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="location" ref={ref}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className={styles.tagline}>Find Us</span>
          <h2 className={styles.heading}>
            Visit Our <br />
            <span className="accent">Clinic.</span>
          </h2>
          <p className={styles.intro}>
            Conveniently located at Laskarati Bazar, Newtown, Kolkata —
            just behind Unitech Gate 2 with easy access and parking.
          </p>

          <div className={styles.contactList}>
            {CONTACT.map((c, i) => (
              <motion.div
                key={c.title}
                className={styles.contactItem}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              >
                <div className={styles.contactIcon}>
                  <Icon icon={c.icon} width={24} height={24} />
                </div>
                <div>
                  <h4 className={styles.contactTitle}>{c.title}</h4>
                  <p className={styles.contactDetail} style={{ whiteSpace: 'pre-line' }}>
                    {c.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <a
            href={MAPS_SRC}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            Get Directions
          </a>
        </motion.div>

        <motion.div
          className={styles.mapWrap}
          initial={{ opacity: 0, x: 28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        >
          {isIframeLoading && (
            <div className={styles.loader}>
              <Icon icon="solar:re-order-linear" className={styles.spinner} width={40} height={40} />
              <span className={styles.loaderText}>Loading Map...</span>
            </div>
          )}
          <iframe
            src={MAPS_SRC}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block', opacity: isIframeLoading ? 0 : 1, transition: 'opacity 0.3s' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Clinic Location"
            onLoad={() => setIsIframeLoading(false)}
          />
        </motion.div>
      </div>
    </section>
  )
}
