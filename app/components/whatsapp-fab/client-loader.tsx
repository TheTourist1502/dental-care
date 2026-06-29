'use client'
import dynamic from 'next/dynamic'

const WhatsAppFAB = dynamic(() => import('./index'), { ssr: false })

export default function WhatsAppFABLoader() {
  return <WhatsAppFAB />
}
