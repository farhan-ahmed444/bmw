import { useState, useRef, useCallback, useEffect, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiAdjustmentsHorizontal,
  HiXMark,
  HiChevronDown,
  HiFunnel,
} from 'react-icons/hi2'
import { cn } from '../../utils/cn'
import { useStore } from '../../store/useStore'
import { series, fuelTypes, bodyTypes, transmissions } from '../../data/bmwData'

const MIN_YEAR = 1970
const MAX_YEAR = 2026
const MIN_PRICE = 0
const MAX_PRICE = 1000000
const MIN_HP = 0
const MAX_HP = 1000

interface FilterPanelProps {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function FilterPanel({ label, defaultOpen = true, children }: FilterPanelProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-4 text-sm font-medium text-white/80 hover:text-white transition-colors"
        type="button"
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <HiChevronDown className="w-3.5 h-3.5 text-white/40" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface RangeSliderProps {
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (v: number) => string
}

function RangeSlider({ min, max, step, value, onChange, formatValue }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [local, setLocal] = useState(value)
  const dragging = useRef<'min' | 'max' | null>(null)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const clamp = (v: number) => Math.max(min, Math.min(max, v))
  const snap = (v: number) => Math.round(v / step) * step

  const getValueFromClient = useCallback(
    (clientX: number) => {
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect) return 0
      const pct = (clientX - rect.left) / rect.width
      return clamp(min + pct * (max - min))
    },
    [min, max],
  )

  const handleMouseDown = (thumb: 'min' | 'max') => (e: MouseEvent) => {
    e.preventDefault()
    dragging.current = thumb
    const handleMove = (ev: globalThis.MouseEvent) => {
      if (!dragging.current) return
      const raw = getValueFromClient(ev.clientX)
      const snapped = snap(raw)
      setLocal((prev) => {
        const next: [number, number] = [...prev]
        if (dragging.current === 'min') {
          next[0] = Math.min(snapped, prev[1] - step)
        } else {
          next[1] = Math.max(snapped, prev[0] + step)
        }
        return next
      })
    }
    const handleUp = () => {
      dragging.current = null
      onChange(local)
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  const pctMin = ((local[0] - min) / (max - min)) * 100
  const pctMax = ((local[1] - min) / (max - min)) * 100

  return (
    <div className="pt-2 pb-1">
      <div
        ref={trackRef}
        className="relative h-1.5 rounded-full bg-white/10 cursor-pointer"
      >
        <div
          className="absolute top-0 h-full rounded-full bg-bmw-blue"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-bmw-blue shadow-md cursor-grab active:cursor-grabbing -ml-2"
          style={{ left: `${pctMin}%` }}
          onMouseDown={handleMouseDown('min')}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-bmw-blue shadow-md cursor-grab active:cursor-grabbing -ml-2"
          style={{ left: `${pctMax}%` }}
          onMouseDown={handleMouseDown('max')}
        />
      </div>
      <div className="flex justify-between mt-2 text-[11px] text-white/50">
        <span>{formatValue ? formatValue(local[0]) : local[0]}</span>
        <span>{formatValue ? formatValue(local[1]) : local[1]}</span>
      </div>
    </div>
  )
}

interface CheckboxGroupProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

function CheckboxGroup({ options, selected, onChange }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt))
    } else {
      onChange([...selected, opt])
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isChecked = selected.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={cn(
              'px-3 py-1.5 text-xs rounded-lg border transition-all duration-200',
              isChecked
                ? 'bg-bmw-blue/20 border-bmw-blue/50 text-bmw-blue-light'
                : 'bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20 hover:text-white/80',
            )}
            type="button"
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function FilterBar() {
  const {
    filters: { series: selSeries, years, priceRange, horsepowerRange, transmission: selTrans, fuelType: selFuel, bodyType: selBody },
    setFilter,
    clearFilters,
  } = useStore()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const hasActiveFilters =
    selSeries.length > 0 ||
    years[0] !== MIN_YEAR || years[1] !== MAX_YEAR ||
    priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ||
    horsepowerRange[0] !== MIN_HP || horsepowerRange[1] !== MAX_HP ||
    selTrans.length > 0 ||
    selFuel.length > 0 ||
    selBody.length > 0

  const filterGroups = (
    <>
      <FilterPanel label="Series">
        <CheckboxGroup
          options={series}
          selected={selSeries}
          onChange={(v) => setFilter('series', v)}
        />
      </FilterPanel>

      <FilterPanel label="Year">
        <RangeSlider
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={years}
          onChange={(v) => setFilter('years', v)}
        />
      </FilterPanel>

      <FilterPanel label="Price">
        <RangeSlider
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={5000}
          value={priceRange}
          onChange={(v) => setFilter('priceRange', v)}
          formatValue={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
      </FilterPanel>

      <FilterPanel label="Horsepower">
        <RangeSlider
          min={MIN_HP}
          max={MAX_HP}
          step={10}
          value={horsepowerRange}
          onChange={(v) => setFilter('horsepowerRange', v)}
          formatValue={(v) => `${v} hp`}
        />
      </FilterPanel>

      <FilterPanel label="Transmission" defaultOpen={false}>
        <CheckboxGroup
          options={transmissions}
          selected={selTrans}
          onChange={(v) => setFilter('transmission', v)}
        />
      </FilterPanel>

      <FilterPanel label="Fuel Type" defaultOpen={false}>
        <CheckboxGroup
          options={fuelTypes}
          selected={selFuel}
          onChange={(v) => setFilter('fuelType', v)}
        />
      </FilterPanel>

      <FilterPanel label="Body Type" defaultOpen={false}>
        <CheckboxGroup
          options={bodyTypes}
          selected={selBody}
          onChange={(v) => setFilter('bodyType', v)}
        />
      </FilterPanel>
    </>
  )

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all lg:hidden"
          type="button"
        >
          <HiAdjustmentsHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-bmw-blue text-[10px] font-bold text-white">
              {(selSeries.length > 0 ? 1 : 0) +
                (years[0] !== MIN_YEAR || years[1] !== MAX_YEAR ? 1 : 0) +
                (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? 1 : 0) +
                (horsepowerRange[0] !== MIN_HP || horsepowerRange[1] !== MAX_HP ? 1 : 0) +
                selTrans.length +
                selFuel.length +
                selBody.length}
            </span>
          )}
        </button>

        <div className="hidden lg:flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/50 hover:text-white transition-colors"
              type="button"
            >
              <HiXMark className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <HiFunnel className="w-4 h-4 text-bmw-blue" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Filters
            </span>
          </div>
          {filterGroups}
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-bmw-dark/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <HiFunnel className="w-4 h-4 text-bmw-blue" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Filters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-white/50 hover:text-white transition-colors"
                      type="button"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-center w-8 h-8 text-white/60 hover:text-white transition-colors"
                    type="button"
                    aria-label="Close filters"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {filterGroups}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
