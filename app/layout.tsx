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
  metadataBase: new URL('https://drmariadental.in'),
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
  alternates: {
    canonical: 'https://drmariadental.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Dr. Maria's Multi-Speciality Dental Clinic | Newtown, Kolkata",
    description: 'Expert dental care behind Unitech Gate 2, Newtown. Book your appointment today.',
    url: 'https://drmariadental.in',
    type: 'website',
    locale: 'en_IN',
    siteName: "Dr. Maria's Dental Clinic",
    images: [
      {
        url: '/images/clinic.webp',
        width: 1200,
        height: 630,
        alt: "Dr. Maria's Multi-Speciality Dental Clinic, Newtown Kolkata",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Best Dentist in Newtown, Kolkata | Dr. Maria's Dental Clinic",
    description: 'Expert dental care behind Unitech Gate 2, Newtown. Book your appointment today.',
    images: ['/images/clinic.webp'],
  },
  icons: {
    icon: [
      { url: '/images/favicon.ico' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
        <link rel="preload" as="image" href="/images/hero.webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Dentist',
              name: "Dr. Maria's Multi-Speciality Dental Clinic",
              description: "Multi-speciality dental clinic in Newtown, Kolkata offering root canal treatment, dental implants, braces, pediatric dentistry and more. Located behind Unitech Gate 2, Laskarati Bazar.",
              image: [
                'https://drmariadental.in/images/clinic.webp',
                'https://drmariadental.in/images/doctor.webp',
              ],
              '@id': 'https://maps.app.goo.gl/7srQyKdNtGLcaKG29',
              url: 'https://drmariadental.in',
              hasMap: 'https://maps.app.goo.gl/7srQyKdNtGLcaKG29',
              telephone: '+918102175261',
              email: 'contact@drmariadental.in',
              priceRange: '₹₹',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Laskarati Bazar, Baligori Rd, Behind Unitech Gate 2, Newtown',
                addressLocality: 'Kolkata',
                addressRegion: 'West Bengal',
                postalCode: '700156',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 22.5761589,
                longitude: 88.4878267,
              },
              areaServed: [
                'Newtown', 'Rajarhat', 'Action Area I', 'Action Area II',
                'Action Area III', 'New Town', 'Kolkata',
              ],
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday'],
                  opens: '16:00',
                  closes: '21:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  opens: '09:00',
                  closes: '14:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  opens: '17:00',
                  closes: '21:00',
                },
              ],
              sameAs: [
                'https://maps.app.goo.gl/7srQyKdNtGLcaKG29',
                'https://www.instagram.com/drmariadental',
                'https://www.facebook.com/drmariadental',
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

