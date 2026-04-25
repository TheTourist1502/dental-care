'use client'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

const SERVICES_LINKS = ['General Dentistry', 'Cosmetic Dentistry', 'Dental Implants', 'Orthodontics', 'Pediatric']
const CLINIC_LINKS = ['About Dr. Maria', 'Gallery', 'Testimonials', 'Blog', 'Careers']
const CONTACT_LINKS = ['+91 81021 75261', 'WhatsApp Us', 'contact@drmariadental.in', 'Newtown, Kolkata']

const SOCIALS = [
  { icon: 'brandico:facebook', label: 'Facebook' },
  { icon: 'brandico:instagram', label: 'Instagram' },
  { icon: 'brandico:linkedin', label: 'LinkedIn' },
  { icon: 'brandico:youtube', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <a href="#home" className={styles.logo}>
              <Icon icon="solar:star-fall-minimalistic-bold" className={styles.logoIcon} />
              Dr. Maria&apos;s Dental
            </a>
            <p className={styles.tagline}>
              Multi-speciality dental clinic dedicated to creating healthy,
              beautiful smiles with compassion and expertise.
            </p>
            <div className={styles.social}>
              {SOCIALS.map((s) => (
                <button key={s.label} className={styles.socialBtn} aria-label={s.label}>
                  <Icon icon={s.icon} width={18} height={18} />
                </button>
              ))}
            </div>
          </div>


          <div>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.colList}>
              {SERVICES_LINKS.map((l) => (
                <li key={l}><a href="#services">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Clinic</h4>
            <ul className={styles.colList}>
              {CLINIC_LINKS.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.colList}>
              {CONTACT_LINKS.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>Copyright © {new Date().getFullYear()} Dr. Maria&apos;s Multi-speciality Dental Clinic. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Sales and Refunds</span>
            <span>Legal</span>
            <span>Site Map</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
