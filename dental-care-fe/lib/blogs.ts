import blogs from '@/data/blogs.json'

export type BlogPost = {
  slug: string
  title: string
  author: string
  date: string
  image: string
  subtitle: string
  content: string
  readTime: string
}

export function getAllPosts(): BlogPost[] {
  return blogs as BlogPost[]
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

// Source content is one long paragraph — split into readable paragraphs
// of ~3 sentences each for the article page.
export function toParagraphs(content: string, sentencesPer = 3): string[] {
  const sentences = content.match(/[^.!?]+[.!?]+["']?(\s+|$)/g) ?? [content]
  const paragraphs: string[] = []
  for (let i = 0; i < sentences.length; i += sentencesPer) {
    paragraphs.push(sentences.slice(i, i + sentencesPer).join('').trim())
  }
  return paragraphs.filter(Boolean)
}
