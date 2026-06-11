import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiChevronRight, FiClock } from 'react-icons/fi'
import { cn } from '../../utils/cn'
import { legacyEras } from '../../data/bmwData'
import type { LegacyEra } from '../../types'
import ParallaxImage from '../ui/ParallaxImage'

gsap.registerPlugin(ScrollTrigger)

export default function LegacyTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const cards = gsap.utils.toArray<HTMLElement>('.legacy-card')
    const cardWidth = window.innerWidth * 0.9 + 48
    const totalWidth = cards.length * cardWidth - window.innerWidth * 0.1

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * cards.length),
              cards.length - 1,
            )
            setActiveIndex(idx)
          },
        },
        defaults: { ease: 'none' },
      })

      tl.to(track, {
        x: () => -(totalWidth),
        ease: 'none',
      })

      cards.forEach((card, i) => {
        const yearBadge = card.querySelector('.era-year-badge')
        const title = card.querySelector('.era-title')
        const subtitle = card.querySelector('.era-subtitle')
        const desc = card.querySelector('.era-description')
        const cars = card.querySelector('.era-cars')

        const cardStart = i / cards.length

        tl
          .fromTo(
            yearBadge,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.1 },
            cardStart,
          )
          .fromTo(
            title,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.08 },
            cardStart + 0.02,
          )
          .fromTo(
            subtitle,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.06 },
            cardStart + 0.04,
          )
          .fromTo(
            desc,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.06 },
            cardStart + 0.06,
          )
          .fromTo(
            Array.from(card.querySelectorAll('.era-car-item')),
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.04, stagger: 0.015 },
            cardStart + 0.08,
          )
      })

      gsap.to(progressRef.current, {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-bmw-dark"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-bmw-dark via-[#0a0a1a] to-[#001a33] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center pt-8 gap-3">
        <FiClock className="w-4 h-4 text-bmw-blue" />
        <span className="text-xs tracking-[0.2em] uppercase text-white/40 font-light">
          Legacy Timeline
        </span>
      </div>

      <div
        ref={progressRef}
        className="absolute top-16 left-0 h-[2px] bg-bmw-blue/60 z-20"
        style={{ width: '100%', transform: 'scaleX(0)', transformOrigin: 'left center' }}
      />

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {legacyEras.map((era, i) => (
          <button
            key={era.year}
            type="button"
            onClick={() => {
              const cards = gsap.utils.toArray<HTMLElement>('.legacy-card')
              const target = cards[i]
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', inline: 'center' })
              }
            }}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-500',
              activeIndex === i
                ? 'bg-bmw-blue/20 text-bmw-blue border border-bmw-blue/40'
                : 'text-white/30 border border-transparent hover:text-white/60',
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-500',
                activeIndex === i ? 'bg-bmw-blue scale-125' : 'bg-white/20',
              )}
            />
            {era.year}
          </button>
        ))}
      </div>

      <div
        ref={trackRef}
        className="flex items-center h-full will-change-transform"
        style={{ gap: '48px', paddingLeft: '5vw', paddingRight: '5vw' }}
      >
        {legacyEras.map((era: LegacyEra, i: number) => (
          <div
            key={era.year}
            className={cn(
              'legacy-card relative flex-shrink-0 w-[90vw] h-[65vh] rounded-sm overflow-hidden',
              'border border-white/5',
            )}
            style={{
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div className="absolute inset-0">
              <ParallaxImage
                src={era.image}
                alt={era.title}
                speed={0.4}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-bmw-dark/95 via-bmw-dark/60 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col justify-center w-full h-full max-w-2xl px-8 md:px-16 lg:px-24">
              <div className="era-year-badge inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase border rounded-sm w-fit border-bmw-blue/30 text-bmw-blue bg-bmw-blue/10">
                {era.year}
              </div>

              <h2 className="era-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {era.title}
              </h2>

              <p className="era-subtitle mt-2 text-base sm:text-lg md:text-xl text-bmw-blue/80 font-light tracking-wide">
                {era.subtitle}
              </p>

              <p className="era-description mt-4 text-sm sm:text-base text-white/50 leading-relaxed max-w-lg">
                {era.description}
              </p>

              <div className="era-cars mt-6 flex flex-wrap gap-2">
                {era.cars.map((car) => (
                  <span
                    key={car}
                    className="era-car-item inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium tracking-wider uppercase rounded-sm border border-white/10 text-white/60 hover:border-bmw-blue/30 hover:text-bmw-blue hover:bg-bmw-blue/5 transition-all duration-300"
                  >
                    <FiChevronRight className="w-3 h-3 text-bmw-blue/60" />
                    {car}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {legacyEras.map((era, i) => (
          <button
            key={era.year}
            type="button"
            onClick={() => {
              const cards = gsap.utils.toArray<HTMLElement>('.legacy-card')
              const target = cards[i]
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', inline: 'center' })
              }
            }}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-500',
              activeIndex === i
                ? 'bg-bmw-blue w-6'
                : 'bg-white/20 hover:bg-white/40',
            )}
            aria-label={`Go to ${era.year}: ${era.title}`}
          />
        ))}
      </div>
    </section>
  )
}
