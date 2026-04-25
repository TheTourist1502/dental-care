import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import './styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Best Dentist in Newtown, Kolkata | Dr. Maria's Dental Clinic",
  description:
    "Dr. Maria's Multi-speciality Dental Clinic near Unitech Gate 2, Newtown. Expert Root Canal, Implants, & Braces. Book your appointment in Kolkata today.",
  keywords: [
    'dentist in Newtown Kolkata',
    'dental clinic near Unitech Gate 2',
    'best dentist in Newtown',
    'Dr Maria dental clinic Kolkata',
    'root canal treatment Newtown',
    'dental implants Kolkata',
    'pediatric dentist Newtown',
  ],
  openGraph: {
    title: "Dr. Maria's Multi-Speciality Dental Clinic | Newtown, Kolkata",
    description: 'Expert dental care behind Unitech Gate 2, Newtown. Book your appointment today.',
    type: 'website',
    locale: 'en_IN',
    siteName: "Dr. Maria's Dental Clinic",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/hero.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Dentist',
              name: "Dr. Maria's Multi-Speciality Dental Clinic",
              image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09',
              '@id': 'https://maps.app.goo.gl/8uKbdBRzh2N6zFyy9',
              url: 'https://drmariadental.in',
              telephone: '+91 81021 75261',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Laskarati Bazar, Behind Unitech Gate 2, Newtown',
                addressLocality: 'Kolkata',
                addressRegion: 'West Bengal',
                postalCode: '700156',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 22.5855,
                longitude: 88.4867
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday'],
                  opens: '16:00',
                  closes: '21:00'
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  opens: '09:00',
                  closes: '14:00'
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  opens: '17:00',
                  closes: '21:00'
                }
              ],
              sameAs: [
                'https://www.instagram.com/drmariadental',
                'https://www.facebook.com/drmariadental'
              ]
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

