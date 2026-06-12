import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bmwVehicles } from '../../data/bmwData'
import type { BMWVehicle } from '../../types'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'
import { HiMusicalNote, HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'

gsap.registerPlugin(ScrollTrigger)

const mModels = bmwVehicles.filter((v) => v.category === 'M Series')

const featureNames = ['M2', 'M3', 'M4', 'M5', 'M8', 'XM']
const featureCars = featureNames
  .map((name) => mModels.find((v) => v.name.startsWith(name)))
  .filter((v): v is BMWVehicle => v !== undefined)

export default function MDivision() {
  const [soundOn, setSoundOn] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = trailRef.current?.querySelectorAll('.speed-line')
    if (lines) {
      gsap.fromTo(
        lines,
        { x: '-100%', opacity: 0 },
        {
          x: '200%',
          opacity: (i: number) => (i % 2 === 0 ? 0.6 : 0.3),
          duration: () => gsap.utils.random(1.5, 3),
          repeat: -1,
          ease: 'none',
          stagger: 0.3,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }

    cardsRef.current.forEach((card) => {
      if (!card) return
      gsap.fromTo(
        card,
        { x: 200, opacity: 0, rotateY: 45 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        },
      )
    })

    gsap.fromTo(
      '.m-bg-accent',
      { y: -50 },
      {
        y: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, { scope: sectionRef })

  const cardVariants = {
    hidden: { opacity: 0, x: 100, rotateY: 30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-carbon via-[#0a0a0a] to-carbon" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#1C69D4 1px, transparent 1px), linear-gradient(90deg, #1C69D4 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="m-bg-accent absolute -top-20 -right-20 w-72 h-72 bg-bmw-blue/5 rounded-full blur-3xl" />
      <div className="m-bg-accent absolute -bottom-20 -left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

      <div ref={trailRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="speed-line absolute h-px"
            style={{
              top: `${10 + i * 11}%`,
              width: `${30 + Math.random() * 40}%`,
              background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? '#E31C28' : '#1C69D4'}, transparent)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="section-padding mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-gradient-to-r from-[#1C69D4] to-[#E31C28]" />
              <span className="text-sm font-bold tracking-[0.25em] text-white/80">
                THE M DIVISION
              </span>
              <span className="w-8 h-[2px] bg-gradient-to-r from-[#E31C28] to-[#00A3E0]" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Unleash the{' '}
              <span className="bg-gradient-to-r from-[#1C69D4] via-[#E31C28] to-[#00A3E0] bg-clip-text text-transparent">
                Beast
              </span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
              Born on the Nürburgring, engineered for the road. Each M car is a testament
              to BMW&apos;s motorsport heritage — pushing the boundaries of performance,
              precision, and driving exhilaration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8"
          >
            <Button
              variant="outline"
              size="sm"
              icon={
                soundOn ? (
                  <HiSpeakerWave className="w-4 h-4" />
                ) : (
                  <HiSpeakerXMark className="w-4 h-4" />
                )
              }
              onClick={() => setSoundOn((prev) => !prev)}
            >
              <span className="flex items-center gap-2">
                <HiMusicalNote
                  className={cn(
                    'w-3.5 h-3.5 text-bmw-blue transition-transform duration-300',
                    soundOn && 'animate-spin',
                  )}
                />
                Engine Sound
              </span>
            </Button>
          </motion.div>
        </div>

        <div className="section-padding grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCars.map((car, i) => (
            <motion.div
              key={car.id}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="group relative overflow-hidden rounded-sm"
            >
              <div className="relative h-[400px] bg-gradient-to-b from-carbon/80 to-carbon border border-white/5 group-hover:border-white/20 transition-colors duration-500">
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img
                    src={car.images[0]}
                    alt={car.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    draggable={false}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/60 to-transparent" />

                <div className="absolute top-0 left-0 right-0 h-1 flex">
                  <div className="flex-1 bg-[#1C69D4]" />
                  <div className="flex-1 bg-[#E31C28]" />
                  <div className="flex-1 bg-[#00A3E0]" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
                    {car.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 glass-strong px-3 py-1.5 rounded-sm">
                      <span className="text-[10px] font-bold tracking-wider text-bmw-blue">HP</span>
                      <span className="text-sm font-bold text-white">{car.horsepower}</span>
                    </div>

                    <div className="flex items-center gap-1.5 glass-strong px-3 py-1.5 rounded-sm">
                      <span className="text-[10px] font-bold tracking-wider text-red-400">0-60</span>
                      <span className="text-sm font-bold text-white">{car.acceleration}s</span>
                    </div>

                    <div className="flex items-center gap-1.5 glass-strong px-3 py-1.5 rounded-sm">
                      <span className="text-[10px] font-bold tracking-wider text-white/60">TOP</span>
                      <span className="text-sm font-bold text-white">{car.topSpeed}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="section-padding mt-12 text-center"
        >
          <Button variant="m" size="lg" onClick={() => {}}>
            Explore All M Models
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
