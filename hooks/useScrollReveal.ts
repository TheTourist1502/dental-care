'use client'
import { useEffect, useRef } from 'react'

interface Options {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * Returns a ref to attach to any element.
 * Adds `data-visible="true"` when it enters the viewport,
 * which your CSS can target with [data-visible="true"] selectors.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: Options = {}
) {
  const { threshold = 0.12, rootMargin = '0px', once = true } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = 'true'
          if (once) obs.disconnect()
        } else if (!once) {
          el.dataset.visible = 'false'
        }
      },
      { threshold, rootMargin }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  return ref
}
