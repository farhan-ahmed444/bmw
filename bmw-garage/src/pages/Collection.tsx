import { motion, AnimatePresence } from 'framer-motion'
import { HiSquares2X2, HiViewColumns, HiArrowsPointingOut } from 'react-icons/hi2'
import { HiXMark } from 'react-icons/hi2'
import { cn } from '../utils/cn'
import { useStore } from '../store/useStore'
import SearchBar from '../components/collection/SearchBar'
import FilterBar from '../components/collection/FilterBar'
import CarGrid from '../components/collection/CarGrid'
import type { ViewMode } from '../types'

const viewModes: { mode: ViewMode; icon: typeof HiSquares2X2 }[] = [
  { mode: 'grid', icon: HiSquares2X2 },
  { mode: 'masonry', icon: HiViewColumns },
  { mode: 'fullscreen', icon: HiArrowsPointingOut },
]

export default function Collection() {
  const filters = useStore((s) => s.filters)
  const setFilter = useStore((s) => s.setFilter)
  const setViewMode = useStore((s) => s.setViewMode)
  const clearFilters = useStore((s) => s.clearFilters)
  const filteredVehicles = useStore((s) => s.filteredVehicles)

  const activeChips: { label: string; onRemove: () => void }[] = []

  filters.series.forEach((s) =>
    activeChips.push({ label: s, onRemove: () => setFilter('series', filters.series.filter((x) => x !== s)) }),
  )
  filters.transmission.forEach((t) =>
    activeChips.push({
      label: t,
      onRemove: () => setFilter('transmission', filters.transmission.filter((x) => x !== t)),
    }),
  )
  filters.fuelType.forEach((f) =>
    activeChips.push({
      label: f,
      onRemove: () => setFilter('fuelType', filters.fuelType.filter((x) => x !== f)),
    }),
  )
  filters.bodyType.forEach((b) =>
    activeChips.push({
      label: b,
      onRemove: () => setFilter('bodyType', filters.bodyType.filter((x) => x !== b)),
    }),
  )

  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-bmw-dark"
    >
      <div className="section-padding pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              The <span className="text-gradient">Collection</span>
            </h1>
            <p className="mt-3 text-white/50 text-base md:text-lg max-w-2xl">
              Explore every BMW model — from iconic classics to the latest electric performance machines.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <SearchBar />
          </motion.div>
        </div>
      </div>

      <div className="section-padding pb-24">
        <div className="max-w-7xl mx-auto flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterBar />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/50">
                  <span className="text-white font-semibold">{filteredVehicles.length}</span> models
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-1 border border-white/10">
                {viewModes.map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200',
                      filters.viewMode === mode
                        ? 'bg-bmw-blue text-white shadow-sm'
                        : 'text-white/40 hover:text-white/80 hover:bg-white/5',
                    )}
                    type="button"
                    aria-label={`${mode} view`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {activeChips.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-2 mb-4 overflow-hidden"
                >
                  {activeChips.map((chip) => (
                    <span
                      key={chip.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-bmw-blue/10 border border-bmw-blue/25 text-bmw-blue-light"
                    >
                      {chip.label}
                      <button
                        onClick={chip.onRemove}
                        className="hover:text-white transition-colors"
                        type="button"
                        aria-label={`Remove ${chip.label} filter`}
                      >
                        <HiXMark className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors ml-1"
                    type="button"
                  >
                    Clear all
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <CarGrid />
          </div>
        </div>
      </div>
    </motion.main>
  )
}
