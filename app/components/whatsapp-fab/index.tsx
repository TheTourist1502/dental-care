'use client'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

const PHONE = '918102175261'
const MESSAGE = encodeURIComponent('Hi Dr. Maria, I would like to book an appointment.')

export default function WhatsAppFAB() {
  return (
    <motion.a
      href={`https://wa.me/${PHONE}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: 56,
        height: 56,
        background: '#25d366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(37,211,102,0.3)',
        zIndex: 200,
        textDecoration: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon icon="logos:whatsapp-icon" width={32} height={32} />
    </motion.a>
  )
}
