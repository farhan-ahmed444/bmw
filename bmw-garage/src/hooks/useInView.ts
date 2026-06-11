import { useRef, useState, useEffect, useCallback } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setIsInView(true)
        if (once && ref.current) {
          observer?.unobserve(ref.current)
        }
      } else if (!once) {
        setIsInView(false)
      }
    },
    [once]
  )

  let observer: IntersectionObserver | null = null

  useEffect(() => {
    const el = ref.current
    if (!el) return

    observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })
    observer.observe(el)

    return () => {
      observer?.disconnect()
    }
  }, [threshold, rootMargin, handleIntersection])

  return { ref, isInView }
}
