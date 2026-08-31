import type { MetadataRoute } from 'next'
import { CLINIC } from '@/lib/clinic'

// Required for `output: "export"` — metadata route handlers must be
// explicitly marked static or the build (and dev server) throws.
export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: CLINIC.name,
    short_name: CLINIC.shortName,
    description: 'Book your dental appointment online at Dr. Maria\'s Multi-Speciality Dental Clinic, Newtown, Kolkata.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ff385c',
    icons: [
      { src: '/images/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
