'use client'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

const ITEMS = [
  { 
    image: '/images/clinic.webp', 
    label: 'Reception Area', 
    span: true 
  },
  { 
    image: '/images/equipment.webp', 
    label: 'Treatment Room', 
    span: false 
  },
  { 
    image: '/images/equipment.webp', 
    label: 'Modern Equipment', 
    span: false 
  },
  { 
    image: '/images/smiles.webp', 
    label: 'Happy Smiles', 
    span: false 
  },
  { 
    image: '/images/results.webp', 
    label: 'Cosmetic Results', 
    span: false 
  },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState<null | typeof ITEMS[0]>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.container}>
        <span className={styles.tagline}>Our Clinic</span>
        <h2 className={styles.heading}>
          Experience Our <br />
          <span className="accent">Modern Clinic.</span>
        </h2>

        <div className={styles.grid} ref={ref}>
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              className={`${styles.item} ${item.span ? styles.span : ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => setLightbox(item)}
            >
              <div 
                className={styles.inner}
                style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className={styles.overlay}>
                <span className={styles.label}>{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className={styles.lightboxBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className={styles.lightboxCard}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={styles.lightboxImg}
                style={{ backgroundImage: `url(${lightbox.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className={styles.lightboxLabel}>{lightbox.label}</div>
              <button className={styles.closeBtn} onClick={() => setLightbox(null)}>
                <Icon icon="solar:close-circle-linear" width={20} height={20} />
                <span>Close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
