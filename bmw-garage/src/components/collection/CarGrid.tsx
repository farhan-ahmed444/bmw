import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useStore } from '../../store/useStore'
import CarCard from './CarCard'
import type { ViewMode, BMWVehicle } from '../../types'

const LOAD_STEP = 12

export default function CarGrid() {
  const filteredVehicles = useStore((s) => s.filteredVehicles)
  const viewMode = useStore((s) => s.filters.viewMode)
  const [visibleCount, setVisibleCount] = useState(LOAD_STEP)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const prevViewMode = useRef(viewMode)

  useEffect(() => {
    setVisibleCount(LOAD_STEP)
  }, [filteredVehicles.length])

  useEffect(() => {
    if (prevViewMode.current !== viewMode) {
      setVisibleCount(LOAD_STEP)
      prevViewMode.current = viewMode
    }
  }, [viewMode])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + LOAD_STEP, filteredVehicles.length))
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [filteredVehicles.length])

  const visible = filteredVehicles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVehicles.length

  const masonryColumns = useCallback(() => {
    const cols: BMWVehicle[][] = [[], [], []]
    visible.forEach((v, i) => cols[i % 3].push(v))
    return cols
  }, [visible])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/50">
          <span className="text-white font-medium">{filteredVehicles.length}</span> models found
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {viewMode === 'masonry' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {masonryColumns().map((col, ci) => (
              <div key={ci} className="flex flex-col gap-6">
                {col.map((vehicle, vi) => (
                  <CarCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    viewMode={viewMode}
                    index={vi * 3 + ci}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'fullscreen'
                ? 'grid-cols-1'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            )}
          >
            {visible.map((vehicle, i) => (
              <CarCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-white/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="w-5 h-5 rounded-full border-2 border-white/20 border-t-bmw-blue"
            />
            <span className="text-sm">Loading more models...</span>
          </div>
        </div>
      )}

      {!hasMore && visible.length > 0 && (
        <div className="flex items-center justify-center py-10">
          <span className="text-xs text-white/20 tracking-widest uppercase">
            End of collection
          </span>
        </div>
      )}

      {visible.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <span className="text-2xl text-white/20">?</span>
          </div>
          <h3 className="text-lg font-medium text-white/60">No models match your filters</h3>
          <p className="text-sm text-white/30 mt-1 max-w-md">
            Try adjusting your filter criteria or clearing all filters to see the full collection.
          </p>
        </motion.div>
      )}
    </div>
  )
}
