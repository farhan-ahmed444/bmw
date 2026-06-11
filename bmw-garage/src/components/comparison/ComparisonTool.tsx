import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBarChart2, FiX } from 'react-icons/fi'
import { cn } from '../../utils/cn'
import { bmwVehicles } from '../../data/bmwData'
import RadarChart from './RadarChart'
import ComparisonSlider from './ComparisonSlider'
import type { BMWVehicle } from '../../types'

const CATEGORIES: { title: string; specs: { label: string; key: keyof BMWVehicle; suffix?: string }[] }[] = [
  {
    title: 'Performance',
    specs: [
      { label: 'Horsepower', key: 'horsepower', suffix: ' HP' },
      { label: 'Torque', key: 'torque', suffix: ' lb-ft' },
      { label: '0-100 km/h', key: 'acceleration', suffix: ' s' },
      { label: 'Top Speed', key: 'topSpeed', suffix: ' mph' },
    ],
  },
  {
    title: 'Engine',
    specs: [
      { label: 'Displacement', key: 'displacement' },
      { label: 'Drivetrain', key: 'drivetrain' },
      { label: 'Transmission', key: 'transmission' },
    ],
  },
  {
    title: 'Dimensions',
    specs: [{ label: 'Weight', key: 'weight', suffix: ' lbs' }],
  },
  {
    title: 'Pricing',
    specs: [{ label: 'Price', key: 'price', suffix: '' }],
  },
]

const RADAR_LABELS = ['Horsepower', 'Torque', 'Top Speed', 'Accel.', 'Weight']
const RADAR_GETTERS: ((car: BMWVehicle) => number)[] = [
  (c) => c.horsepower,
  (c) => c.torque,
  (c) => c.topSpeed,
  (c) => 10 - c.acceleration,
  (c) => 7000 - c.weight,
]

export default function ComparisonTool() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['', '', ''])
  const [showComparison, setShowComparison] = useState(false)

  const selectedCars = useMemo(
    () => selectedIds.map((id) => bmwVehicles.find((v) => v.id === id) ?? null),
    [selectedIds],
  )

  const activeCars = useMemo(
    () => selectedCars.filter((c): c is BMWVehicle => c !== null),
    [selectedCars],
  )

  const availableCars = useMemo(
    () => bmwVehicles.filter((v) => !selectedIds.includes(v.id)),
    [selectedIds],
  )

  const handleSelect = (index: number, id: string) => {
    const next = [...selectedIds]
    next[index] = id
    setSelectedIds(next)
    setShowComparison(false)
  }

  const handleClear = (index: number) => {
    const next = [...selectedIds]
    next[index] = ''
    setSelectedIds(next)
    setShowComparison(false)
  }

  const formatValue = (car: BMWVehicle, key: keyof BMWVehicle, suffix?: string) => {
    const val = car[key]
    if (key === 'price') return `$${Number(val).toLocaleString()}`
    return `${val}${suffix ?? ''}`
  }

  const bestInClass = (key: keyof BMWVehicle, higherIsBetter: boolean) => {
    if (activeCars.length < 2) return null
    const vals = activeCars.map((c) => Number(c[key]))
    return higherIsBetter ? Math.max(...vals) : Math.min(...vals)
  }

  return (
    <section className="section-padding py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <FiBarChart2 className="text-bmw-blue" size={24} />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Compare BMWs
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Select up to 3 vehicles and compare their specs side by side
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                'relative rounded-lg border border-white/10 p-4 bg-carbon/50 min-h-[120px]',
                selectedIds[i] && 'border-bmw-blue/30',
              )}
            >
              {selectedIds[i] && selectedCars[i] ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedCars[i]!.name}</p>
                      <p className="text-[11px] text-white/40">{selectedCars[i]!.year} &middot; {selectedCars[i]!.horsepower} HP</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClear(i)}
                      className="p-1 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                  <div className="h-16 -mx-4 -mb-4 mt-1 overflow-hidden rounded-b-lg">
                    <img
                      src={selectedCars[i]!.images[0]}
                      alt={selectedCars[i]!.name}
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-white/40 font-medium uppercase tracking-wider">
                    Car {i + 1}
                  </label>
                  <select
                    value=""
                    onChange={(e) => handleSelect(i, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white outline-none focus:border-bmw-blue/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a BMW...</option>
                    {availableCars.map((car) => (
                      <option key={car.id} value={car.id} className="bg-carbon">
                        {car.name} ({car.year})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {activeCars.length >= 2 && showComparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-lg border border-white/10 p-6 bg-carbon/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Radar</h3>
                  <RadarChart
                    cars={activeCars}
                    labels={RADAR_LABELS}
                    getValue={(car, i) => RADAR_GETTERS[i](car)}
                    className="max-w-md mx-auto"
                  />
                </div>

                <div className="rounded-lg border border-white/10 p-6 bg-carbon/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Visual Comparison</h3>
                  <ComparisonSlider car1={activeCars[0]} car2={activeCars[1]} field="horsepower" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 pr-4 text-white/40 font-medium text-xs uppercase tracking-wider">Specification</th>
                      {activeCars.map((car) => (
                        <th key={car.id} className="text-center py-3 px-4 text-white font-semibold text-sm whitespace-nowrap min-w-[140px]">
                          {car.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CATEGORIES.map((cat) => (
                      <>
                        <tr key={cat.title}>
                          <td
                            colSpan={activeCars.length + 1}
                            className="pt-6 pb-2 text-bmw-blue text-xs font-bold uppercase tracking-wider"
                          >
                            {cat.title}
                          </td>
                        </tr>
                        {cat.specs.map((spec) => {
                          const best = bestInClass(spec.key, spec.key !== 'acceleration' && spec.key !== 'weight')
                          return (
                            <tr key={spec.key} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 pr-4 text-white/50 text-xs">{spec.label}</td>
                              {activeCars.map((car) => {
                                const val = formatValue(car, spec.key, spec.suffix)
                                const numVal = Number(car[spec.key])
                                const isBest = best !== null && numVal === best
                                return (
                                  <td
                                    key={car.id}
                                    className={cn(
                                      'text-center py-3 px-4 text-sm whitespace-nowrap',
                                      isBest ? 'text-bmw-blue font-semibold' : 'text-white/70',
                                    )}
                                  >
                                    {val}
                                    {isBest && <span className="ml-1 text-[10px] text-bmw-blue">&#9733;</span>}
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeCars.length >= 2 && !showComparison && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowComparison(true)}
              className="px-8 py-3 bg-bmw-blue text-white font-medium rounded hover:bg-bmw-blue-light transition-colors text-sm"
            >
              Compare {activeCars.length} Vehicles
            </button>
          </div>
        )}

        {activeCars.length < 2 && (
          <p className="text-center text-white/30 text-sm">
            Select at least 2 BMWs to start comparing
          </p>
        )}
      </div>
    </section>
  )
}
