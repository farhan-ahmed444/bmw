import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSave, FiFolder } from 'react-icons/fi'
import { cn } from '../../utils/cn'
import { useGarageStore } from '../../store/useGarageStore'
import { bmwVehicles } from '../../data/bmwData'
import GarageSlot from './GarageSlot'

export default function GarageBuilder() {
  const { garageSlots, removeFromGarage, saveCollection, loadCollection, savedCollections } =
    useGarageStore()

  const [showSaveInput, setShowSaveInput] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [showLoadDropdown, setShowLoadDropdown] = useState(false)

  const filledCount = useMemo(() => garageSlots.filter((s) => s.car !== null).length, [garageSlots])

  const handleDrop = (slotIndex: number) => {
    const slot = garageSlots[slotIndex]
    if (slot.car) return
    const storedId = localStorage.getItem('bmw-garage-drag-id')
    if (!storedId) return
    const car = bmwVehicles.find((v) => v.id === storedId)
    if (car) {
      useGarageStore.getState().addToGarage(car)
    }
    localStorage.removeItem('bmw-garage-drag-id')
  }

  const handleSave = () => {
    const name = collectionName.trim()
    if (!name) return
    saveCollection(name)
    setCollectionName('')
    setShowSaveInput(false)
  }

  const handleLoad = (name: string) => {
    loadCollection(name)
    setShowLoadDropdown(false)
  }

  return (
    <section className="section-padding py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Your Dream Garage
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Drag BMWs from the collection or browse to build your garage
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.span
              key={filledCount}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.4 }}
              className={cn(
                'text-3xl font-bold tabular-nums',
                filledCount === 6 ? 'text-bmw-blue' : 'text-white/80',
              )}
            >
              {filledCount}
              <span className="text-white/30 text-xl">/6</span>
            </motion.span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <AnimatePresence mode="popLayout">
            {garageSlots.map((slot, index) => (
              <GarageSlot
                key={slot.id}
                slot={slot}
                index={index}
                onRemove={removeFromGarage}
                onDrop={handleDrop}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 justify-center flex-wrap">
          {showSaveInput ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Collection name..."
                className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded text-white placeholder-white/30 outline-none focus:border-bmw-blue/50 transition-colors"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!collectionName.trim()}
                className={cn(
                  'px-4 py-2 text-sm rounded font-medium transition-all',
                  collectionName.trim()
                    ? 'bg-bmw-blue text-white hover:bg-bmw-blue-light'
                    : 'bg-white/5 text-white/30 cursor-not-allowed',
                )}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { setShowSaveInput(false); setCollectionName('') }}
                className="px-3 py-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSaveInput(true)}
              disabled={filledCount === 0}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded transition-all',
                filledCount > 0
                  ? 'bg-bmw-blue text-white hover:bg-bmw-blue-light'
                  : 'bg-white/5 text-white/30 cursor-not-allowed',
              )}
            >
              <FiSave size={16} />
              Save Collection
            </button>
          )}

          {savedCollections.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLoadDropdown(!showLoadDropdown)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <FiFolder size={16} />
                Load Collection
              </button>
              {showLoadDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 right-0 bg-carbon border border-white/10 rounded-lg overflow-hidden z-20 min-w-[200px] shadow-xl"
                >
                  {savedCollections.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleLoad(c.name)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>{c.name}</span>
                      <span className="text-[11px] text-white/30">{c.slotIds.length} cars</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
