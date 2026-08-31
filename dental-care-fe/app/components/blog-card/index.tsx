import Link from 'next/link'
import type { BlogPost } from '@/lib/blogs'
import styles from './index.module.css'

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blogs/${post.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className={styles.image}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{post.date}</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>{post.readTime}</span>
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.subtitle}</p>
        <span className={styles.readMore}>Read article →</span>
      </div>
    </Link>
  )
}
