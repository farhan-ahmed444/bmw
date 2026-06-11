import { useRef } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/home/Hero'
import LegacyTimeline from '../components/home/LegacyTimeline'
import CategoriesShowcase from '../components/home/CategoriesShowcase'
import MDivision from '../components/home/MDivision'
import ExperienceCenter from '../components/home/ExperienceCenter'
import CommunityShowcase from '../components/home/CommunityShowcase'

const marqueeModels = [
  'M2', 'M3', 'M4', 'M5', 'M8', 'XM', 'i4', 'i5', 'i7',
  'iX', 'X5', 'X7', 'Z4', '3 Series', '5 Series', '7 Series',
]

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

export default function Home() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  return (
    <main>
      <section id="hero">
        <Hero />
      </section>

      <section id="legacy">
        <LegacyTimeline />
      </section>

      <section id="categories">
        <motion.div {...fadeUp}>
          <CategoriesShowcase />
        </motion.div>
      </section>

      <section id="m-division">
        <motion.div {...fadeUp}>
          <MDivision />
        </motion.div>
      </section>

      <section id="experience">
        <motion.div {...fadeUp}>
          <ExperienceCenter />
        </motion.div>
      </section>

      <section id="community">
        <motion.div {...fadeUp}>
          <CommunityShowcase />
        </motion.div>
      </section>

      <section className="relative overflow-hidden border-t border-white/5 bg-bmw-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-bmw-blue/5 via-transparent to-bmw-blue/5" />
        <div className="relative py-10" ref={marqueeRef}>
          <div className="flex whitespace-nowrap animate-marquee">
            <div className="flex items-center gap-16 mx-8">
              {marqueeModels.map((model) => (
                <span
                  key={model}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/5 hover:text-white/20 transition-colors duration-500 select-none"
                >
                  {model}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-16 mx-8" aria-hidden>
              {marqueeModels.map((model) => (
                <span
                  key={`dup-${model}`}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/5 select-none"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
