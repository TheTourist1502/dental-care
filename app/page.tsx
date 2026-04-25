import dynamic from 'next/dynamic'
import styles from './index.module.css'

// Keep Navbar and Hero standard for LCP
import Navbar from './components/navbar'
import Hero from './components/hero'

// Lazy load the rest
const About = dynamic(() => import('./components/about'), { ssr: true })
const Services = dynamic(() => import('./components/services'), { ssr: true })
const Testimonials = dynamic(() => import('./components/testimonials'), { ssr: true })
const Gallery = dynamic(() => import('./components/gallery'), { ssr: true })
const AppointmentForm = dynamic(() => import('./components/appointment'), { ssr: true })
const Location = dynamic(() => import('./components/location'), { ssr: true })
const Footer = dynamic(() => import('./components/footer'), { ssr: true })
const WhatsAppFAB = dynamic(() => import('./components/whatsapp-fab'), { ssr: false })

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <Gallery />
      <AppointmentForm />
      <Location />
      <Footer />
      <WhatsAppFAB />
    </main>
  )
}
