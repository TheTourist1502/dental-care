import type { MetadataRoute } from 'next'
import { CLINIC } from '@/lib/clinic'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${CLINIC.siteUrl}/sitemap.xml`,
  }
}
