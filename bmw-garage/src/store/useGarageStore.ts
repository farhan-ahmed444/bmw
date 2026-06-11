import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GarageSlot, BMWVehicle } from '../types'
import { bmwVehicles } from '../data/bmwData'

interface GarageStoreState {
  garageSlots: GarageSlot[]
  savedCollections: { name: string; slotIds: string[] }[]
  addToGarage: (car: BMWVehicle) => void
  removeFromGarage: (slotId: string) => void
  isInGarage: (carId: string) => boolean
  saveCollection: (name: string) => void
  loadCollection: (name: string) => void
}

const createEmptySlots = (): GarageSlot[] =>
  Array.from({ length: 6 }, (_, i) => ({ id: `slot-${i + 1}`, car: null }))

export const useGarageStore = create<GarageStoreState>()(
  persist(
    (set, get) => ({
      garageSlots: createEmptySlots(),
      savedCollections: [],

      addToGarage: (car) =>
        set((state) => {
          const emptySlot = state.garageSlots.find((s) => s.car === null)
          if (!emptySlot) return state
          return {
            garageSlots: state.garageSlots.map((s) =>
              s.id === emptySlot.id ? { ...s, car } : s,
            ),
          }
        }),

      removeFromGarage: (slotId) =>
        set((state) => ({
          garageSlots: state.garageSlots.map((s) =>
            s.id === slotId ? { ...s, car: null } : s,
          ),
        })),

      isInGarage: (carId) =>
        get().garageSlots.some((s) => s.car?.id === carId),

      saveCollection: (name) => {
        const carIds = get()
          .garageSlots.filter((s) => s.car !== null)
          .map((s) => s.car!.id)
        set((state) => ({
          savedCollections: [
            ...state.savedCollections,
            { name, slotIds: carIds },
          ],
        }))
      },

      loadCollection: (name) => {
        const collection = get().savedCollections.find((c) => c.name === name)
        if (!collection) return
        const cars = collection.slotIds
          .map((id) => bmwVehicles.find((v) => v.id === id))
          .filter((c): c is BMWVehicle => c !== undefined)
        set({
          garageSlots: get().garageSlots.map((s, i) => ({
            ...s,
            car: cars[i] ?? null,
          })),
        })
      },
    }),
    { name: 'bmw-garage-storage' },
  ),
)
