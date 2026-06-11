import { useRef, useState, useCallback, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHeart, HiEye, HiMiniFire } from 'react-icons/hi2'
import { cn } from '../../utils/cn'
import { useGarageStore } from '../../store/useGarageStore'
import type { BMWVehicle, ViewMode } from '../../types'

interface CarCardProps {
  vehicle: BMWVehicle
  viewMode: ViewMode
  index: number
}

export default function CarCard({ vehicle, viewMode, index }: CarCardProps) {
  const navigate = useNavigate()
  const { addToGarage, removeFromGarage, isInGarage } = useGarageStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const inGarage = isInGarage(vehicle.id)

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({ x: (y - 0.5) * -16, y: (x - 0.5) * 16 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  const handleToggleGarage = (e: MouseEvent) => {
    e.stopPropagation()
    if (inGarage) {
      removeFromGarage(vehicle.id)
    } else {
      addToGarage(vehicle)
    }
  }

  const isFullscreen = viewMode === 'fullscreen'
  const isMasonry = viewMode === 'masonry'
  const masonryHeight = isMasonry
    ? index % 3 === 0 ? 'h-[440px]' : index % 3 === 1 ? 'h-[360px]' : 'h-[400px]'
    : ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45, delay: (index % 12) * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group/card relative cursor-pointer perspective-1000',
        isFullscreen ? 'col-span-full' : '',
        isMasonry ? `break-inside-avoid mb-6 ${masonryHeight}` : '',
      )}
      onClick={() => navigate(`/collection/${vehicle.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/collection/${vehicle.id}`) }}
      role="button"
      tabIndex={0}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: isHovered ? tilt.x : 0,
          rotateY: isHovered ? tilt.y : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
        className={cn(
          'relative w-full h-full overflow-hidden rounded-xl preserve-3d',
          'glass transition-shadow duration-500',
          isHovered ? 'shadow-[0_20px_60px_-10px_rgba(0,102,177,0.3)]' : 'shadow-none',
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={cn('relative overflow-hidden', isFullscreen ? 'h-96' : 'h-52 sm:h-56')}>
          {!imgLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
          <motion.img
            src={vehicle.images[0]}
            alt={vehicle.name}
            onLoad={() => setImgLoaded(true)}
            className={cn(
              'w-full h-full object-cover transition-transform duration-700',
              isHovered ? 'scale-110' : 'scale-100',
            )}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-bmw-dark/80 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {vehicle.horsepower >= 500 && (
              <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-red-600/90 text-white backdrop-blur-sm">
                <HiMiniFire className="w-3 h-3" />
                {vehicle.horsepower} HP
              </span>
            )}
            {vehicle.isElectric && (
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-bmw-blue/90 text-white backdrop-blur-sm">
                Electric
              </span>
            )}
            {vehicle.isClassic && (
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-600/90 text-white backdrop-blur-sm">
                Classic
              </span>
            )}
          </div>

          <button
            onClick={handleToggleGarage}
            className={cn(
              'absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md transition-all duration-300',
              inGarage
                ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/25'
                : 'bg-black/40 text-white/70 hover:text-white hover:bg-black/60',
            )}
            type="button"
            aria-label={inGarage ? 'Remove from garage' : 'Add to garage'}
          >
            <motion.div
              animate={inGarage ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <HiHeart className={cn('w-4 h-4', inGarage ? 'fill-current' : '')} />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={isHovered ? { y: 0, opacity: 1 } : { y: 12, opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm font-medium"
            >
              <HiEye className="w-4 h-4" />
              Quick View
            </motion.div>
          </motion.div>
        </div>

        <div className={cn('p-4', isFullscreen && 'flex items-start gap-6')}>
          <div className={cn(isFullscreen ? 'flex-1' : '')}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white truncate group-hover/card:text-bmw-blue-light transition-colors">
                  {vehicle.name}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">{vehicle.series}</p>
              </div>
              {vehicle.horsepower < 500 && (
                <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded bg-white/10 text-white/80">
                  {vehicle.horsepower} hp
                </span>
              )}
            </div>

            {isFullscreen && (
              <p className="mt-2 text-sm text-white/60 line-clamp-2 leading-relaxed">
                {vehicle.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <span className="text-sm font-bold text-bmw-blue-light">
                ${vehicle.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-3 text-[11px] text-white/50">
                <span>{vehicle.year}</span>
                {vehicle.fuelType !== 'Gasoline' && (
                  <span className="uppercase tracking-wider">{vehicle.fuelType}</span>
                )}
                <span className="uppercase tracking-wider">{vehicle.transmission}</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(0,102,177,0.08) 0%, transparent 60%)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
