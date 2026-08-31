'use client'
import { useRef } from 'react'
import { Icon } from '@iconify/react'
import { motion, useInView } from 'framer-motion'
import pricing from '@/data/pricing.json'
import styles from './index.module.css'

const inr = new Intl.NumberFormat('en-IN')

export default function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="pricing">
      <div className={styles.container}>
        <span className={styles.tagline}>Transparent Pricing</span>
        <h2 className={styles.heading}>
          Honest Prices, <span className="accent">No Surprises.</span>
        </h2>
        <p className={styles.sub}>
          Know what you&apos;ll pay before you sit in the chair. No hidden
          charges, no pushed treatments.
        </p>

        <div className={styles.grid} ref={ref}>
          {pricing.items.map((item, i) => {
            const savePct = Math.round(
              (1 - item.price / item.originalPrice) * 100
            )
            return (
              <motion.div
                key={item.id}
                className={`${styles.card} ${item.popular ? styles.popular : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {item.popular && (
                  <span className={styles.popularBadge}>Most Popular</span>
                )}
                <div className={styles.cardHead}>
                  <div className={styles.iconWrap}>
                    <Icon icon={item.icon} width={22} height={22} />
                  </div>
                  <span className={styles.save}>Save {savePct}%</span>
                </div>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.desc}>{item.description}</p>
                <div className={styles.priceRow}>
                  <span className={styles.original}>
                    ₹{inr.format(item.originalPrice)}
                  </span>
                  <span className={styles.price}>₹{inr.format(item.price)}</span>
                  <span className={styles.unit}>{item.unit}</span>
                </div>
                <a href="#appointment" className={styles.cta}>
                  Book now
                  <Icon icon="solar:arrow-right-linear" width={16} height={16} />
                </a>
              </motion.div>
            )
          })}
        </div>

        <p className={styles.note}>{pricing.note.split('.')[0]}. Final cost is confirmed after clinical examination.</p>
      </div>
    </section>
  )
}
