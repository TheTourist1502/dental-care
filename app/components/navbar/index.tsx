'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Location', href: '#location' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Active section detection
      const sections = ['home', 'about', 'services', 'testimonials', 'gallery', 'location']
      const scrollPos = window.scrollY + 100

      for (const section of sections) {
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

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <motion.nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.container}>
        <a href="#home" className={styles.logo}>
          <Icon icon="hugeicons:dental-tooth" className={styles.logoIcon} />
          Dr. Maria&apos;s Dental
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a 
                href={link.href} 
                className={`${styles.link} ${activeSection === link.href.replace('#', '') ? styles.active : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button 
            className={styles.themeToggle} 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Icon 
              icon={theme === 'light' ? 'solar:moon-bold-duotone' : 'solar:sun-bold-duotone'} 
              width={20} 
              height={20} 
            />
          </button>
          
          <a href="#appointment" className={styles.cta}>
            Book Now
          </a>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
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
              <a
                key={link.href}
                href={link.href}
                className={`${styles.drawerLink} ${activeSection === link.href.replace('#', '') ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#appointment"
              className={styles.drawerCta}
              onClick={() => setMenuOpen(false)}
            >
              Book Appointment
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
