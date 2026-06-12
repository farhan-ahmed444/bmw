import { create } from 'zustand'
import { BMWVehicle, FilterState, ViewMode } from '../types'
import { bmwVehicles } from '../data/bmwData'

interface StoreState {
  vehicles: BMWVehicle[]
  filters: FilterState & { viewMode: ViewMode }
  selectedVehicle: BMWVehicle | null
  filteredVehicles: BMWVehicle[]
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  setSearch: (search: string) => void
  setViewMode: (viewMode: ViewMode) => void
  selectVehicle: (vehicle: BMWVehicle | null) => void
  clearFilters: () => void
}

const defaultFilters: FilterState & { viewMode: ViewMode } = {
  series: [],
  years: [1970, 2026],
  priceRange: [0, 1000000],
  horsepowerRange: [0, 1000],
  transmission: [],
  fuelType: [],
  bodyType: [],
  search: '',
  viewMode: 'grid',
}

export const useStore = create<StoreState>()((set, get) => {
  const computeFiltered = (): BMWVehicle[] => {
    const { vehicles, filters } = get()
    return vehicles.filter((v) => {
      if (filters.series.length > 0 && !filters.series.includes(v.series)) return false
      if (v.year < filters.years[0] || v.year > filters.years[1]) return false
      if (v.price < filters.priceRange[0] || v.price > filters.priceRange[1]) return false
      if (v.horsepower < filters.horsepowerRange[0] || v.horsepower > filters.horsepowerRange[1]) return false
      if (filters.transmission.length > 0 && !filters.transmission.includes(v.transmission)) return false
      if (filters.fuelType.length > 0 && !filters.fuelType.includes(v.fuelType)) return false
      if (filters.bodyType.length > 0 && !filters.bodyType.includes(v.bodyType)) return false
      if (filters.search) {
        const s = filters.search.toLowerCase()
        if (!v.name.toLowerCase().includes(s) && !v.series.toLowerCase().includes(s) && !v.description.toLowerCase().includes(s)) return false
      }
      return true
    })
  }

  return {
    vehicles: bmwVehicles,
    filters: { ...defaultFilters },
    selectedVehicle: null,

    get filteredVehicles() {
      return computeFiltered()
    },

    setFilter: (key, value) =>
      set((state) => ({
        filters: { ...state.filters, [key]: value },
      })),

    setSearch: (search) =>
      set((state) => ({
        filters: { ...state.filters, search },
      })),

    setViewMode: (viewMode) =>
      set((state) => ({
        filters: { ...state.filters, viewMode },
      })),

    selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

    clearFilters: () =>
      set((state) => ({
        filters: { ...defaultFilters, viewMode: state.filters.viewMode },
      })),
  }
})
