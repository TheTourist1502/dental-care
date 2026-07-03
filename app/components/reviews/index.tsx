'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { motion, useInView } from 'framer-motion'
import reviews from '@/data/reviews.json'
import { CLINIC } from '@/lib/clinic'
import styles from './index.module.css'

const AVATAR_COLORS = [
  '#e8453c', '#d81b60', '#8e24aa', '#3949ab', '#1e88e5',
  '#00897b', '#f4511e', '#6d4c41', '#546e7a', '#c0891b',
]

function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

function formatDate(ddmmyyyy: string) {
  const [d, m, y] = ddmmyyyy.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Google">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41.4 34.9 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  )
}

function Stars({ count }: { count: number }) {
  return (
    <span className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          icon={i < count ? 'solar:star-bold' : 'solar:star-linear'}
          className={i < count ? styles.starFilled : styles.starEmpty}
          width={15}
          height={15}
        />
      ))}
    </span>
  )
}

export default function Reviews() {
  const sectionRef = useRef(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  const average = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1)

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const pages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth))
    setPageCount(pages)
    setPage(Math.min(pages - 1, Math.round(el.scrollLeft / el.clientWidth)))
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  function scrollToPage(p: number) {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: p * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className={styles.section} id="reviews" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.tagline}>Patient Stories</span>
            <h2 className={styles.heading}>What Our Patients Say</h2>
            <div className={styles.summary}>
              <GoogleLogo size={22} />
              <strong className={styles.avg}>{average}</strong>
              <Stars count={5} />
              <span className={styles.count}>
                from {reviews.length}+ Google reviews
              </span>
            </div>
          </div>
          <a
            className={styles.googleLink}
            href={CLINIC.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Review us on Google
            <Icon icon="solar:arrow-right-up-linear" width={16} height={16} />
          </a>
        </div>

        <motion.div
          className={styles.carousel}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className={styles.track}
            ref={trackRef}
            onScroll={measure}
            role="region"
            aria-label="Patient reviews carousel"
            tabIndex={0}
          >
            {reviews.map((r, i) => (
              <article className={styles.card} key={`${r.reviewer}-${r.date}`}>
                <div className={styles.cardTop}>
                  <div
                    className={styles.avatar}
                    style={{ background: avatarColor(r.reviewer) }}
                    aria-hidden="true"
                  >
                    {r.reviewer.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.who}>
                    <div className={styles.name}>{r.reviewer}</div>
                    <div className={styles.date}>{formatDate(r.date)}</div>
                  </div>
                  <div className={styles.gBadge} title="Posted on Google">
                    <GoogleLogo size={18} />
                  </div>
                </div>
                <Stars count={r.rating} />
                <p className={styles.text}>{r.text}</p>
              </article>
            ))}
          </div>

          <div className={styles.controls}>
            <button
              className={styles.arrow}
              onClick={() => scrollToPage(page - 1)}
              disabled={page === 0}
              aria-label="Previous reviews"
            >
              <Icon icon="solar:alt-arrow-left-linear" width={20} height={20} />
            </button>
            <div className={styles.dots}>
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
                  onClick={() => scrollToPage(i)}
                  aria-label={`Go to review page ${i + 1}`}
                />
              ))}
            </div>
            <button
              className={styles.arrow}
              onClick={() => scrollToPage(page + 1)}
              disabled={page >= pageCount - 1}
              aria-label="Next reviews"
            >
              <Icon icon="solar:alt-arrow-right-linear" width={20} height={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
