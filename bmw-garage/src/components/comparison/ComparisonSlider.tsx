import { useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '../../utils/cn'
import type { BMWVehicle } from '../../types'

interface ComparisonSliderProps {
  car1: BMWVehicle
  car2: BMWVehicle
  field: keyof BMWVehicle
  className?: string
}

export default function ComparisonSlider({ car1, car2, field, className }: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = clientX - rect.left
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setPosition(pct)
    },
    [],
  )

  const handleMouseDown = useCallback(() => setIsDragging(true), [])
  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent) => handleMove(e.clientX)
    const onUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, handleMove])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      if (touch) handleMove(touch.clientX)
    },
    [handleMove],
  )

  const val1 = String(car1[field] ?? '')
  const val2 = String(car2[field] ?? '')

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] rounded-lg overflow-hidden select-none bg-carbon cursor-col-resize"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <div className="absolute inset-0 flex">
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
              WebkitClipPath: `inset(0 ${100 - position}% 0 0)`,
            }}
          >
            <img
              src={car1.images[0]}
              alt={car1.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/70 text-xs text-white font-medium">
              {car1.name}
            </div>
          </div>
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 0 0 ${position}%)`,
              WebkitClipPath: `inset(0 0 0 ${position}%)`,
            }}
          >
            <img
              src={car2.images[0]}
              alt={car2.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-xs text-white font-medium">
              {car2.name}
            </div>
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
            <div className="flex gap-0.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6L8 10" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 2L8 6L4 10" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 px-1">
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{val1}</p>
          <p className="text-[11px] text-white/40 capitalize">{String(field)}</p>
        </div>
        <div className="text-[11px] text-white/30">vs</div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{val2}</p>
          <p className="text-[11px] text-white/40 capitalize">{String(field)}</p>
        </div>
      </div>
    </div>
  )
}
