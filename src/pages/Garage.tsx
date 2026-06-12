import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiPlus, FiBarChart2, FiCpu, FiZap } from 'react-icons/fi'
import { cn } from '../utils/cn'
import { useGarageStore } from '../store/useGarageStore'
import { bmwVehicles } from '../data/bmwData'
import GarageBuilder from '../components/garage/GarageBuilder'

export default function Garage() {
  const garageSlots = useGarageStore((s) => s.garageSlots)

  const stats = useMemo(() => {
    const cars = garageSlots.filter((s) => s.car !== null).map((s) => s.car!)

    const totalCars = cars.length
    if (totalCars === 0) {
      return { totalCars: 0, favoriteSeries: '—', avgHorsepower: 0 }
    }

    const avgHorsepower = Math.round(
      cars.reduce((sum, c) => sum + c.horsepower, 0) / totalCars,
    )

    const seriesCount: Record<string, number> = {}
    cars.forEach((c) => {
      seriesCount[c.series] = (seriesCount[c.series] || 0) + 1
    })
    const favoriteSeries = Object.entries(seriesCount).sort((a, b) => b[1] - a[1])[0][0]

    return { totalCars, favoriteSeries, avgHorsepower }
  }, [garageSlots])

  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-bmw-dark"
    >
      <div className="section-padding pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                My <span className="text-gradient">Garage</span>
              </h1>
              <p className="mt-3 text-white/50 text-base md:text-lg max-w-xl">
                Build your ultimate BMW collection. Drag models from the collection into your garage slots.
              </p>
            </div>

            <Link
              to="/collection"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg',
                'bg-bmw-blue text-white hover:bg-bmw-blue-light transition-colors shrink-0',
              )}
            >
              <FiPlus className="w-4 h-4" />
              Add More Cars
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="section-padding pb-16"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<FiBarChart2 className="w-5 h-5" />}
              label="Total Cars"
              value={stats.totalCars.toString()}
              accent={stats.totalCars === 6}
            />
            <StatCard
              icon={<FiCpu className="w-5 h-5" />}
              label="Favorite Series"
              value={stats.favoriteSeries}
            />
            <StatCard
              icon={<FiZap className="w-5 h-5" />}
              label="Avg Horsepower"
              value={stats.avgHorsepower > 0 ? `${stats.avgHorsepower} HP` : '—'}
            />
          </div>
        </div>
      </motion.div>

      <GarageBuilder />
    </motion.main>
  )
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="glass rounded-xl p-5 flex items-center gap-4">
      <div
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-lg shrink-0',
          accent ? 'bg-bmw-blue/20 text-bmw-blue' : 'bg-white/5 text-white/40',
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-white/40 font-medium">{label}</p>
        <p className={cn('text-xl font-bold tracking-tight mt-0.5', accent && 'text-bmw-blue')}>
          {value}
        </p>
      </div>
    </div>
  )
}
