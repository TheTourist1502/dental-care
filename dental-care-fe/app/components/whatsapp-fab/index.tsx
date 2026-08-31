'use client'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import styles from './index.module.css'

const PHONE = '918102175261'
const MESSAGE = encodeURIComponent('Hi Dr. Maria, I would like to book an appointment.')

export default function WhatsAppFAB() {
  return (
    <motion.a
      href={`https://wa.me/${PHONE}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={styles.fab}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon icon="logos:whatsapp-icon" width={28} height={28} />
    </motion.a>
  )
}
