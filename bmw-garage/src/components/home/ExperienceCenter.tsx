import { Suspense, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiMousePointer } from 'react-icons/fi'
import Scene from '../three/Scene'

export default function ExperienceCenter() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.6])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-bmw-dark"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bmw-dark/20 to-bmw-dark z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001a33]/40 via-transparent to-[#001a33]/40 z-10 pointer-events-none" />

      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-bmw-dark">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-bmw-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-white/40 text-sm tracking-widest uppercase">Loading Experience</p>
            </div>
          </div>
        }
      >
        <Scene className="absolute inset-0 w-full h-full" />
      </Suspense>

      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-bmw-blue font-medium tracking-[0.25em] text-sm mb-4"
          >
            EXPERIENCE CENTER
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none"
          >
            Virtual{' '}
            <span className="text-gradient">Showroom</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Explore every detail of our collection in an immersive 3D experience.
            Rotate, zoom, and discover what makes each BMW a masterpiece.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10 inline-flex items-center gap-2 px-5 py-2.5 glass-strong rounded-sm"
          >
            <FiMousePointer className="w-4 h-4 text-bmw-blue" />
            <span className="text-xs tracking-[0.2em] text-white/40 uppercase font-light">
              Click & drag to orbit — scroll to zoom
            </span>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bmw-dark to-transparent z-10 pointer-events-none" />
    </section>
  )
}
