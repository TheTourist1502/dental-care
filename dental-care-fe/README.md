# Dr. Maria's Multi-Speciality Dental Clinic — Next.js Website

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: CSS Modules
- **Animations**: Framer Motion (section reveals, hovers) + GSAP ScrollTrigger (parallax)
- **Validation**: Zod (shared client + server)
- **Database**: MySQL via mysql2 connection pool
- **Deployment**: Vercel

---

## Project Structure

```
app/
├── layout.tsx              # Fonts, metadata, Local Business schema
├── page.tsx                # Assembles all sections
├── styles/globals.css      # Design tokens + global utilities
├── api/
│   └── appointment/
│       └── route.ts        # POST (insert) + GET (list) appointments
└── components/
    ├── navbar/             # Sticky nav, mobile drawer
    ├── hero/               # GSAP parallax, Framer Motion entry
    ├── about/              # Doctor bio, qualification list
    ├── services/           # 6-card grid, staggered reveal
    ├── testimonials/       # 3-card grid
    ├── gallery/            # Masonry grid + lightbox
    ├── appointment/        # Form with Zod validation → /api/appointment
    ├── location/           # Contact info + lazy Google Maps embed
    ├── footer/             # Links + social
    └── WhatsAppFAB.tsx     # Floating WhatsApp button
lib/
├── db.ts                   # MySQL pool singleton
└── validations.ts          # Zod schema (shared)
hooks/
└── useScrollReveal.ts      # IntersectionObserver helper
```

---

## Setup

### 1. Install
```bash
npm install
```

### 2. Database
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE dental_clinic CHARACTER SET utf8mb4;"
```
The `appointments` table auto-creates on first API request.

### 3. Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your DB credentials
```

### 4. Run
```bash
npm run dev
# → http://localhost:3000
```

---

## API

### POST /api/appointment
```json
{
  "name": "John Doe",
  "phone": "+91 9876543210",
  "email": "john@example.com",
  "service": "General Checkup",
  "preferred_date": "2026-05-10",
  "message": "Need consultation"
}
```
Returns `{ success: true, id: 42, message: "..." }` or `{ success: false, errors: {...} }`.

### GET /api/appointment?status=pending&limit=50
Returns list of appointments filtered by status.

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard → Settings → Environment Variables.  
Use PlanetScale or Railway for managed MySQL in production.

---

## Future Enhancements
- [ ] Admin dashboard (`/admin`) — view/confirm/cancel appointments
- [ ] Email confirmations via Nodemailer
- [ ] WhatsApp Business API integration (Twilio)
- [ ] Blog section with MDX
- [ ] Online consultation booking with Calendly embed
