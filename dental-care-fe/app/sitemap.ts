import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blogs'
import { CLINIC } from '@/lib/clinic'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: CLINIC.siteUrl, lastModified: now, priority: 1 },
    { url: `${CLINIC.siteUrl}/blogs`, lastModified: now, priority: 0.8 },
    ...getAllPosts().map((post) => ({
      url: `${CLINIC.siteUrl}/blogs/${post.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
  ]
}
