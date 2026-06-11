import { useCallback, type DragEvent } from 'react'
import { motion } from 'framer-motion'
import { FiTrash2, FiPlus } from 'react-icons/fi'
import { cn } from '../../utils/cn'
import type { GarageSlot } from '../../types'

interface GarageSlotProps {
  slot: GarageSlot
  index: number
  onRemove: (slotId: string) => void
  onDrop: (slotIndex: number) => void
}

export default function GarageSlot({ slot, index, onRemove, onDrop }: GarageSlotProps) {
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      onDrop(index)
    },
    [index, onDrop],
  )

  const handleRemove = useCallback(() => {
    onRemove(slot.id)
  }, [onRemove, slot.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-lg border border-white/10 overflow-hidden min-h-[220px]',
        'transition-all duration-300',
        slot.car
          ? 'bg-carbon border-white/15'
          : 'border-dashed border-white/20 bg-white/5 hover:border-bmw-blue/50 hover:bg-white/[0.07]',
      )}
    >
      {slot.car ? (
        <div className="flex flex-col h-full">
          <div className="relative h-32 overflow-hidden bg-gradient-to-b from-bmw-blue/20 to-transparent">
            <img
              src={slot.car.images[0]}
              alt={slot.car.name}
              className="w-full h-full object-cover opacity-80"
              draggable={false}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white/70 hover:text-red-400 hover:bg-black/80 transition-colors z-10"
              aria-label={`Remove ${slot.car.name}`}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white truncate">{slot.car.name}</h3>
              <p className="text-xs text-white/50">{slot.car.year} &middot; {slot.car.series}</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/60 mt-1">
              <span>{slot.car.horsepower} HP</span>
              <span className="text-white/20">&bull;</span>
              <span>{slot.car.acceleration}s</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[220px] gap-2 text-white/30 hover:text-white/50 transition-colors cursor-default">
          <FiPlus size={28} />
          <span className="text-xs font-medium tracking-wider uppercase">Drop car here</span>
          <span className="text-[10px] text-white/20">Slot {index + 1}</span>
        </div>
      )}
    </motion.div>
  )
}
