import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Navigation, Pagination, Zoom } from 'swiper/modules'
import { HiArrowLeft, HiHeart, HiShare, HiScale, HiChevronDown, HiCheck } from 'react-icons/hi2'
import { bmwVehicles } from '../data/bmwData'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import Button from '../components/ui/Button'
import { useGarageStore } from '../store/useGarageStore'
import { cn } from '../utils/cn'

gsap.registerPlugin(ScrollTrigger)

export default function ModelDetail() {
  const { id } = useParams<{ id: string }>()
  const car = bmwVehicles.find((v) => v.id === id)
  const { garageSlots, addToGarage, removeFromGarage, isInGarage } = useGarageStore()
  const [galleryOpen, setGalleryOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const specsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!heroRef.current) return
    const chars = heroRef.current.querySelectorAll('.hero-char')
    gsap.fromTo(chars, { y: 120, opacity: 0, rotateX: -60 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.04, ease: 'power4.out' })
  }, { scope: heroRef })

  useGSAP(() => {
    if (!specsRef.current) return
    gsap.fromTo(specsRef.current.querySelectorAll('.spec-card'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: specsRef.current, start: 'top 80%' } })
  }, { scope: specsRef })

  useGSAP(() => {
    if (!featuresRef.current) return
    gsap.fromTo(featuresRef.current.querySelectorAll('.feature-item'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' } })
  }, { scope: featuresRef })

  if (!car) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-6">
        <h1 className="text-6xl font-bold text-gradient">404</h1>
        <p className="text-silver text-xl">This model doesn't exist in our collection</p>
        <Link to="/"><Button variant="primary">Back to Collection</Button></Link>
      </div>
    )
  }

  const inGarage = isInGarage(car.id)
  const carSlot = garageSlots.find(s => s.car?.id === car.id)

  return (
    <div className="bg-bmw-dark min-h-screen">
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10" />
        <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover scale-110" />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-12 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 mb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-silver/80 border border-white/10 rounded-full px-4 py-1.5">{car.year}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-silver/80 border border-white/10 rounded-full px-4 py-1.5">{car.series}</span>
              <span className="text-xs uppercase tracking-[0.2em] text-bmw-blue border border-bmw-blue/30 rounded-full px-4 py-1.5">{car.category}</span>
            </div>
            <h1 className="text-8xl md:text-9xl font-black text-white leading-none mb-2">
              {car.name.split('').map((ch, i) => (
                <span key={i} className="hero-char inline-block">{ch === ' ' ? '\u00A0' : ch}</span>
              ))}
            </h1>
            <p className="text-xl text-silver/80 max-w-xl">{car.description.slice(0, 120)}...</p>
          </div>
        </div>
        <div className="absolute top-8 left-8 z-30">
          <Link to="/collection" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <HiArrowLeft className="text-xl" /><span className="text-sm">Back</span>
          </Link>
        </div>
        <div className="absolute top-8 right-8 z-30 flex gap-3">
          <button onClick={() => setGalleryOpen(true)} className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-all"><HiShare /></button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <HiChevronDown className="text-2xl text-white/40" />
        </div>
      </div>

      <section ref={specsRef} className="section-padding py-24 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-4">Specifications</h2>
        <p className="text-silver/60 text-lg mb-16">Every detail engineered for performance</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SpecCard label="Horsepower" value={car.horsepower} suffix=" hp" />
          <SpecCard label="Torque" value={car.torque} suffix=" lb-ft" />
          <SpecCard label="0-100 km/h" value={car.acceleration} suffix="s" decimals={1} />
          <SpecCard label="Top Speed" value={car.topSpeed} suffix=" mph" />
          <SpecCard label="Weight" value={car.weight} suffix=" lbs" />
          <SpecCard label="Price" value={car.price} prefix="$" />
        </div>
      </section>

      <section className="section-padding py-24 bg-carbon/30 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-4">Performance</h2>
        <p className="text-silver/60 text-lg mb-16">Engineered to thrill</p>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.15em] text-silver/50 mb-2">Displacement</p>
              <p className="text-2xl font-bold">{car.displacement}</p>
            </div>
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.15em] text-silver/50 mb-2">Drivetrain</p>
              <p className="text-2xl font-bold">{car.drivetrain}</p>
            </div>
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.15em] text-silver/50 mb-2">Transmission</p>
              <p className="text-2xl font-bold">{car.transmission}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-silver/50 mb-2">Fuel Type</p>
              <p className="text-2xl font-bold">{car.fuelType}</p>
            </div>
          </div>
          <div className="relative">
            <SpeedGauge speed={car.topSpeed} horsepower={car.horsepower} />
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="section-padding py-24 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-4">Highlights</h2>
        <p className="text-silver/60 text-lg mb-16">What makes this model extraordinary</p>
        <div className="grid md:grid-cols-3 gap-6">
          {car.highlights.map((h, i) => (
            <motion.div key={i} className="feature-item glass p-8 rounded-2xl" whileHover={{ y: -8, transition: { duration: 0.3 } }}>
              <div className="w-12 h-12 rounded-full bg-bmw-blue/20 flex items-center justify-center mb-5"><HiCheck className="text-bmw-blue text-xl" /></div>
              <h3 className="text-xl font-bold text-white mb-2">{h}</h3>
              <p className="text-silver/60 text-sm">Signature {car.name} capability</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding py-24 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <p className="text-3xl font-bold">Ready to own the <span className="text-gradient">{car.name}</span>?</p>
            <p className="text-silver/60 mt-2">Starting at ${car.price.toLocaleString()}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="primary" onClick={() => { inGarage && carSlot ? removeFromGarage(carSlot.id) : addToGarage(car) }}>
              <HiHeart className={cn('text-lg', inGarage && 'text-red-500 fill-red-500')} />
              {inGarage ? 'Remove from Garage' : 'Add to Garage'}
            </Button>
            <Link to={`/comparison?cars=${car.id}`}><Button variant="outline"><HiScale className="text-lg" /> Compare</Button></Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {galleryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
            <button onClick={() => setGalleryOpen(false)} className="absolute top-6 right-6 z-10 text-white/70 hover:text-white text-2xl">Close</button>
            <img src={car.images[0]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SpecCard({ label, value, suffix, prefix, decimals = 0 }: { label: string; value: number; suffix?: string; prefix?: string; decimals?: number }) {
  return (
    <div className="spec-card glass p-6 rounded-2xl">
      <p className="text-xs uppercase tracking-[0.15em] text-silver/50 mb-2">{label}</p>
      <div className="text-3xl md:text-4xl font-black text-white">
        {prefix && <span>{prefix}</span>}
        <AnimatedCounter from={0} to={value} duration={2} decimals={decimals} />
        {suffix && <span className="text-lg text-silver/60 ml-1">{suffix}</span>}
      </div>
    </div>
  )
}

function SpeedGauge({ speed, horsepower }: { speed: number; horsepower: number }) {
  const maxSpeed = 205
  const angle = (speed / maxSpeed) * 180
  return (
    <div className="relative w-full max-w-[350px] mx-auto aspect-square">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path d="M 20 160 A 80 80 0 0 1 180 160" fill="none" stroke="#1a1a1a" strokeWidth="12" strokeLinecap="round" />
        <path d="M 20 160 A 80 80 0 0 1 180 160" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(angle / 180) * 251.2} 251.2`} />
        <defs><linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0066B1" /><stop offset="100%" stopColor="#1a8cd8" /></linearGradient></defs>
        <line x1="100" y1="160" x2="100" y2="40" stroke="white" strokeWidth="2" transform={`rotate(${angle - 90}, 100, 160)`} strokeLinecap="round" />
        <circle cx="100" cy="160" r="6" fill="#0066B1" />
        <text x="100" y="130" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{speed}</text>
        <text x="100" y="145" textAnchor="middle" fill="#666" fontSize="8">MPH</text>
      </svg>
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-3xl font-black text-white">{horsepower}</p>
        <p className="text-xs text-silver/50 uppercase tracking-[0.15em]">Horsepower</p>
      </div>
    </div>
  )
}
