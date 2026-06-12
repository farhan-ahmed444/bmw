import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../utils/cn'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxImageProps {
  src: string
  alt: string
  speed?: number
  className?: string
}

export default function ParallaxImage({ src, alt, speed = 0.5, className }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    if (!container || !image) return

    const ctx = gsap.context(() => {
      const movement = speed * 200
      gsap.fromTo(
        image,
        { y: -movement / 2 },
        {
          y: movement / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, container)

    return () => ctx.revert()
  }, [speed])

  return (
    <div ref={containerRef} className={cn('overflow-hidden', className)}>
      <img ref={imageRef} src={src} alt={alt} className="w-full h-full object-cover" draggable={false} />
    </div>
  )
}
