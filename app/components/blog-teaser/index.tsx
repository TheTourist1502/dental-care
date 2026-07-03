import Link from 'next/link'
import BlogCard from '@/app/components/blog-card'
import { getAllPosts } from '@/lib/blogs'
import styles from './index.module.css'

export default function BlogTeaser() {
  const latest = getAllPosts().slice(0, 3)

  return (
    <section className={styles.section} id="blog">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.tagline}>Our Blog</span>
            <h2 className={styles.heading}>Latest Dental Health Tips</h2>
          </div>
          <Link href="/blogs" className={styles.viewAll}>
            View all articles →
          </Link>
        </div>
        <div className={styles.grid}>
          {latest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
