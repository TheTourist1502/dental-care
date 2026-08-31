import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/navbar'
import Footer from '@/app/components/footer'
import Breadcrumb from '@/app/components/breadcrumb'
import BlogCard from '@/app/components/blog-card'
import { getAllPosts, getPost, toParagraphs } from '@/lib/blogs'
import { CLINIC } from '@/lib/clinic'
import styles from './index.module.css'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const description = post.subtitle.split('. ').slice(0, 2).join('. ')
  return {
    title: `${post.title} | Dr. Maria's Dental Clinic`,
    description,
    alternates: { canonical: `${CLINIC.siteUrl}/blogs/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `${CLINIC.siteUrl}/blogs/${post.slug}`,
      images: [{ url: post.image }],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const paragraphs = toParagraphs(post.content)
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.subtitle,
        image: post.image,
        author: { '@type': 'Organization', name: CLINIC.name },
        publisher: { '@type': 'Organization', name: CLINIC.name },
        mainEntityOfPage: `${CLINIC.siteUrl}/blogs/${post.slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: CLINIC.siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${CLINIC.siteUrl}/blogs` },
          { '@type': 'ListItem', position: 3, name: post.title },
        ],
      },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className={styles.page}>
        <article className={styles.article}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blogs' },
              { label: post.title },
            ]}
          />

          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <span className={styles.author}>{post.author}</span>
              <span className={styles.dot} aria-hidden="true" />
              <span>{post.date}</span>
              <span className={styles.dot} aria-hidden="true" />
              <span>{post.readTime}</span>
            </div>
          </header>

          <div className={styles.imageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className={styles.image} />
          </div>

          <p className={styles.lead}>{post.subtitle}</p>

          <div className={styles.body}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <aside className={styles.cta}>
            <div>
              <h2 className={styles.ctaTitle}>Have a similar concern?</h2>
              <p className={styles.ctaText}>
                Consultation is just ₹200 at our Newtown clinic. Book a slot
                online in under a minute.
              </p>
            </div>
            <Link href="/#appointment" className={styles.ctaBtn}>
              Book an Appointment
            </Link>
          </aside>
        </article>

        <section className={styles.related}>
          <div className={styles.relatedInner}>
            <h2 className={styles.relatedTitle}>More from our blog</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
