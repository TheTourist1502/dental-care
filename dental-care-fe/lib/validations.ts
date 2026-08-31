import { z } from 'zod'
import { TIME_SLOTS } from './clinic'

const INDIAN_MOBILE = /^[6-9]\d{9}$/

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name')
    .max(40, 'Name is too long')
    // \p{L}\p{M} accepts names in any script (Bengali, Hindi, ...), not just A–Z
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, 'Please enter a valid name'),

  phone: z
    .string()
    .trim()
    .min(1, 'Please enter your mobile number')
    .regex(INDIAN_MOBILE, 'Enter a valid 10-digit mobile number'),

  date: z
    .string()
    .min(1, 'Please pick a date')
    .refine((iso) => {
      const picked = new Date(iso + 'T00:00:00')
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return !isNaN(picked.getTime()) && picked >= today
    }, 'Please pick today or a future date'),

  timeSlot: z
    .string()
    .min(1, 'Please choose a time slot')
    .refine(
      (slot) => (TIME_SLOTS as readonly string[]).includes(slot),
      'Please choose a time slot'
    ),
})

export type BookingInput = z.infer<typeof bookingSchema>
