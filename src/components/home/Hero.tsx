import { useRef, useMemo, type CSSProperties } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import Button from '../ui/Button'

gsap.registerPlugin(ScrollTrigger)

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const lightBeam1Ref = useRef<HTMLDivElement>(null)
  const lightBeam2Ref = useRef<HTMLDivElement>(null)

  const particles = useMemo<Particle[]>(() => {
    const arr: Particle[] = []
    for (let i = 0; i < 40; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.1,
      })
    }
    return arr
  }, [])

  const chars = 'Ultimate BMW Collection'.split('')

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(
      lightBeam1Ref.current,
      { x: '-100%', opacity: 0 },
      { x: '100%', opacity: 1, duration: 1.5, ease: 'power2.out' },
      0,
    )
      .fromTo(
        lightBeam2Ref.current,
        { x: '100%', opacity: 0 },
        { x: '-50%', opacity: 1, duration: 2, ease: 'power2.out' },
        0.3,
      )
      .fromTo(
        headlineRef.current ? Array.from(headlineRef.current.querySelectorAll('.hero-char')) : [],
        { y: 120, opacity: 0, rotateX: -60 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.035 },
        0.2,
      )
      .fromTo(
        subheadlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.2,
      )
      .fromTo(
        ctaRef.current ? Array.from(ctaRef.current.querySelectorAll('.hero-cta-btn')) : [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        1.5,
      )
      .fromTo(
        scrollIndicatorRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        2.0,
      )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-bmw-dark"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-bmw-dark via-[#0a0a1a] to-[#001a33]" />

      <div
        ref={lightBeam1Ref}
        className="absolute top-1/4 -left-1/4 w-[150%] h-[2px] opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,102,177,0.3), transparent)',
          transform: 'rotate(-15deg)',
          filter: 'blur(4px)',
        }}
      />
      <div
        ref={lightBeam2Ref}
        className="absolute top-1/2 -left-1/4 w-[150%] h-[1px] opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,102,177,0.15), transparent)',
          transform: 'rotate(10deg)',
          filter: 'blur(8px)',
        }}
      />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(0,102,177,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,102,177,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(0,102,177,0.05) 0%, transparent 50%)',
        }}
      />

      <div className="absolute inset-0" style={{ perspective: '800px' }}>
        <div className="relative w-full h-full">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={
                {
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  opacity: 0,
                  '--tx': `${(Math.random() - 0.5) * 200}px`,
                  '--ty': `${(Math.random() - 0.5) * 200}px`,
                  '--tz': `${(Math.random() - 0.5) * 200}px`,
                  animation: `hero-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 text-center"
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 0.15 }}
        viewport={{ margin: '-40% 0px -30% 0px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto">
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none overflow-hidden"
          >
            <span className="sr-only">Ultimate BMW Collection</span>
            <span aria-hidden="true" className="inline-flex flex-wrap justify-center">
              {chars.map((char, i) => (
                <span
                  key={i}
                  className="hero-char inline-block"
                  style={{
                    opacity: 0,
                    transform: 'translateY(120px) rotateX(-60deg)',
                    whiteSpace: char === ' ' ? 'pre' : undefined,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </h1>

          <p
            ref={subheadlineRef}
            className="mt-6 text-lg sm:text-xl md:text-2xl text-white/60 font-light tracking-wide"
          >
            Explore Every BMW Ever Built
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <div className="hero-cta-btn" style={{ opacity: 0, transform: 'translateY(30px)' }}>
              <Button variant="primary" size="lg">
                Explore Cars
              </Button>
            </div>
            <div className="hero-cta-btn" style={{ opacity: 0, transform: 'translateY(30px)' }}>
              <Button variant="outline" size="lg">
                Build Your Dream Garage
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: 0, transform: 'translateY(-20px)' }}
      >
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs tracking-widest uppercase font-light">Scroll</span>
          <FiChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      <style>{`
        @keyframes hero-particle-drift {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0);
          }
          20% {
            opacity: var(--particle-opacity, 0.4);
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--tx, 100px), var(--ty, -100px), var(--tz, 50px));
          }
        }
      `}</style>
    </section>
  )
}
