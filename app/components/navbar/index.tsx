'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import ThemeToggle from '../theme-toggle'
import styles from './index.module.css'

// section: id used by the scroll-spy on the home page; page links set page: true
const NAV_LINKS = [
  { label: 'About', href: '/#about', section: 'about' },
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'Pricing', href: '/#pricing', section: 'pricing' },
  { label: 'Reviews', href: '/#reviews', section: 'reviews' },
  { label: 'Gallery', href: '/#gallery', section: 'gallery' },
  { label: 'Blog', href: '/blogs', section: null },
]

const SECTIONS = ['home', 'about', 'services', 'pricing', 'reviews', 'gallery', 'appointment', 'blog', 'location']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const pathname = usePathname()
  const onBlogPage = pathname?.startsWith('/blogs') ?? false

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      const scrollPos = window.scrollY + 100
      for (const section of SECTIONS) {
        const element = document.getElementById(section)
        if (element) {
          if (
            element.offsetTop <= scrollPos &&
            element.offsetTop + element.offsetHeight > scrollPos
          ) {
            setActiveSection(section)
          }
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  function isActive(link: (typeof NAV_LINKS)[number]) {
    if (link.section === null) return onBlogPage
    return !onBlogPage && activeSection === link.section
  }

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" width={36} height={36} className={styles.logoImg} />
          Dr. Maria&apos;s Dental
        </Link>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${isActive(link) ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <ThemeToggle />

          <Link href="/#appointment" className={styles.cta}>
            Book Now
          </Link>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <Icon
              icon={menuOpen ? "solar:close-circle-linear" : "solar:menu-dots-bold-duotone"}
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.drawer}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.drawerLink} ${isActive(link) ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#appointment"
              className={styles.drawerCta}
              onClick={() => setMenuOpen(false)}
            >
              Book Appointment
            </Link>
            <ThemeToggle variant="full" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
