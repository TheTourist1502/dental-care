import { z } from 'zod'

export const appointmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters'),

  phone: z
    .string()
    .regex(
      /^(\+91[\s-]?)?[6-9]\d{9}$/,
      'Enter a valid Indian mobile number'
    ),

  email: z
    .string()
    .email('Enter a valid email address')
    .max(100, 'Email too long'),

  service: z.enum([
    'General Checkup',
    'Teeth Cleaning',
    'Dental Implants',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Root Canal',
    'Pediatric Dentistry',
  ]),

  preferred_date: z
    .string()
    .refine((d) => {
      const date = new Date(d)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= today
    }, 'Date cannot be in the past')
    .refine((d) => {
      const date = new Date(d)
      // No appointments on Sundays past 2pm — handled server side
      return !isNaN(date.getTime())
    }, 'Invalid date'),

  message: z.string().max(500, 'Message too long').optional().default(''),
})

export type AppointmentInput = z.infer<typeof appointmentSchema>
