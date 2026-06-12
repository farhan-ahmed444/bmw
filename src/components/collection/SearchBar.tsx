import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import { cn } from '../../utils/cn'
import { useStore } from '../../store/useStore'

export default function SearchBar() {
  const navigate = useNavigate()
  const vehicles = useStore((s) => s.vehicles)
  const search = useStore((s) => s.filters.search)
  const setSearch = useStore((s) => s.setSearch)
  const [localValue, setLocalValue] = useState(search)
  const [results, setResults] = useState<typeof vehicles>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)

  const performSearch = useCallback(
    (query: string) => {
      const q = query.toLowerCase().trim()
      if (!q) {
        setResults([])
        setIsOpen(false)
        return
      }
      const matched = vehicles.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.series.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.bodyType.toLowerCase().includes(q),
      )
      setResults(matched.slice(0, 12))
      setIsOpen(true)
      setSelectedIndex(-1)
    },
    [vehicles],
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(localValue)
      performSearch(localValue)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [localValue, setSearch, performSearch])

  useEffect(() => {
    if (search !== localValue) setLocalValue(search)
  }, [search])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      navigate(`/collection/${results[selectedIndex].id}`)
      setIsOpen(false)
      setLocalValue('')
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setLocalValue('')
    setSearch('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder="Search BMW models, series, or keywords..."
          className={cn(
            'w-full h-12 pl-12 pr-12 text-sm text-white placeholder-white/30',
            'bg-white/5 border border-white/10 rounded-lg',
            'focus:outline-none focus:border-bmw-blue/50 focus:bg-white/[0.07]',
            'transition-all duration-300',
          )}
        />
        <AnimatePresence>
          {localValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-white/40 hover:text-white transition-colors"
              type="button"
              aria-label="Clear search"
            >
              <HiXMark className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-lg border border-white/10 bg-bmw-dark/95 backdrop-blur-2xl shadow-2xl"
            style={{ transformOrigin: 'top center' }}
          >
            <div className="max-h-80 overflow-y-auto">
              {results.map((vehicle, i) => (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    navigate(`/collection/${vehicle.id}`)
                    setIsOpen(false)
                    setLocalValue('')
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={cn(
                    'flex items-center gap-4 w-full px-4 py-3 text-left transition-colors duration-150',
                    i === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5',
                  )}
                  type="button"
                >
                  <div className="w-12 h-10 rounded overflow-hidden shrink-0 bg-white/5">
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {vehicle.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-bmw-blue font-semibold">
                        {vehicle.series}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5">
                      <span>{vehicle.year}</span>
                      <span>{vehicle.horsepower} hp</span>
                      <span>${vehicle.price.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
