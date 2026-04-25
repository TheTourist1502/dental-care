import { NextRequest, NextResponse } from 'next/server'
import { appointmentSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Validate
    const parsed = appointmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // 2. Backend disabled "for now"
    // Mocking a successful database insert
    const insertId = Math.floor(Math.random() * 1000)

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment requested. We will confirm within 1 hour.',
        id: insertId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[/api/appointment POST]', error)
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Backend disabled "for now"
  return NextResponse.json({ success: true, data: [] })
}
