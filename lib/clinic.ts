// Single source of truth for clinic contact details and booking config.
// Update here — every component reads from this file.

export const CLINIC = {
  name: "Dr. Maria's Multi-Speciality Dental Clinic",
  shortName: "Dr. Maria's Dental",
  // Used in the "Hi {doctorName}," admin-email greeting — confirm this
  // matches how the doctor should be addressed before going live.
  doctorName: 'Dr. Maria',
  phoneDisplay: '+91 81021 75261',
  phoneE164: '+918102175261',
  whatsappNumber: '918102175261',
  email: 'contact.drmariadenatlclinic@gmail.com',
  address: 'Laskarati Bazar, Baligori Rd, Behind Unitech Gate 2, Newtown, Kolkata 700156',
  mapsUrl: 'https://maps.app.goo.gl/7srQyKdNtGLcaKG29',
  siteUrl: 'https://drmaria-dental-clinic.com',
} as const

export const TIME_SLOTS = [
  '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',
  '5:00 PM – 6:00 PM',
  '6:00 PM – 7:00 PM',
  '7:00 PM – 8:00 PM',
  '8:00 PM – 9:00 PM',
] as const

// encodeURIComponent guards against #, & and % in user text —
// without it WhatsApp silently truncates the message.
export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/${CLINIC.whatsappNumber}?text=${encodeURIComponent(text)}`
}
