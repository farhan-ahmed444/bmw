import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../utils/cn'

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  text: string
  className?: string
  stagger?: number
  duration?: number
  delay?: number
  mode?: 'chars' | 'words'
}

export default function TextReveal({
  text,
  className,
  stagger = 0.02,
  duration = 0.5,
  delay = 0,
  mode = 'chars',
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll<HTMLElement>('.reveal-item')
    if (!items.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration,
          stagger,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, container)

    return () => ctx.revert()
  }, [text, stagger, duration, delay, mode])

  const elements =
    mode === 'words'
      ? text.split(' ').map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span className="reveal-item inline-block">{word}</span>
            {i < text.split(' ').length - 1 && '\u00A0'}
          </span>
        ))
      : text.split('').map((char, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span className="reveal-item inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))

  return (
    <div ref={containerRef} className={cn('inline', className)}>
      {elements}
    </div>
  )
}
