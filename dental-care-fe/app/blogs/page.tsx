import type { Metadata } from 'next'
import Navbar from '@/app/components/navbar'
import Footer from '@/app/components/footer'
import Breadcrumb from '@/app/components/breadcrumb'
import BlogCard from '@/app/components/blog-card'
import { getAllPosts } from '@/lib/blogs'
import { CLINIC } from '@/lib/clinic'
import styles from './index.module.css'

export const metadata: Metadata = {
  title: "Dental Health Blog | Dr. Maria's Dental Clinic, Newtown Kolkata",
  description:
    'Dental care tips, treatment guides and oral health advice from Dr. Maria\'s Multi-speciality Dental Clinic in Newtown, Kolkata.',
  alternates: { canonical: `${CLINIC.siteUrl}/blogs` },
}

export default function BlogsPage() {
  const posts = getAllPosts()

  return (
    <main>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb
            items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
          />
          <header className={styles.header}>
            <span className={styles.tagline}>Our Blog</span>
            <h1 className={styles.heading}>
              Dental Health, <span className="accent">Explained.</span>
            </h1>
            <p className={styles.sub}>
              Practical guides and advice on oral health from our clinic in
              Newtown, Kolkata — {posts.length} articles and counting.
            </p>
          </header>

          <div className={styles.grid}>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
