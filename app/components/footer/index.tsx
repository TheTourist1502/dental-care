'use client'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { CLINIC, buildWhatsAppUrl } from '@/lib/clinic'
import styles from './index.module.css'

const SERVICES_LINKS = ['General Dentistry', 'Cosmetic Dentistry', 'Dental Implants', 'Orthodontics', 'Pediatric']

const CLINIC_LINKS = [
  { label: 'About Dr. Maria', href: '/#about' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Blog', href: '/blogs' },
]

const CONTACT_LINKS = [
  { label: CLINIC.phoneDisplay, href: `tel:${CLINIC.phoneE164}` },
  { label: 'WhatsApp Us', href: buildWhatsAppUrl('Hi, I would like to know more about your dental services.'), external: true },
  { label: CLINIC.email, href: `mailto:${CLINIC.email}` },
  { label: 'Newtown, Kolkata', href: CLINIC.mapsUrl, external: true },
]

const SOCIALS = [
  { icon: 'brandico:facebook', label: 'Facebook', href: 'https://www.facebook.com/drmariadental' },
  { icon: 'brandico:instagram', label: 'Instagram', href: 'https://www.instagram.com/drmariadental' },
  { icon: 'ic:baseline-whatsapp', label: 'WhatsApp', href: buildWhatsAppUrl('Hi!') },
  { icon: 'solar:map-point-bold', label: 'Google Maps', href: CLINIC.mapsUrl },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <Link href="/" className={styles.logo}>
              <Icon icon="hugeicons:dental-tooth" className={styles.logoIcon} />
              Dr. Maria&apos;s Dental
            </Link>
            <p className={styles.tagline}>
              Multi-speciality dental clinic dedicated to creating healthy,
              beautiful smiles with compassion and expertise.
            </p>
            <div className={styles.social}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  className={styles.socialBtn}
                  aria-label={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon icon={s.icon} width={18} height={18} />
                </a>
              ))}
            </div>
          </div>


          <div>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.colList}>
              {SERVICES_LINKS.map((l) => (
                <li key={l}><Link href="/#services">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Clinic</h4>
            <ul className={styles.colList}>
              {CLINIC_LINKS.map((l) => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.colList}>
              {CONTACT_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>Copyright © {new Date().getFullYear()} Dr. Maria&apos;s Multi-speciality Dental Clinic. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <a href={CLINIC.mapsUrl} target="_blank" rel="noopener noreferrer">Find us on Google Maps</a>
            <Link href="/blogs">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
