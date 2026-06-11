export interface BMWVehicle {
  id: string
  name: string
  year: number
  series: string
  category: string
  horsepower: number
  torque: number
  topSpeed: number
  acceleration: number
  price: number
  transmission: string
  fuelType: string
  bodyType: string
  displacement: string
  drivetrain: string
  weight: number
  images: string[]
  colors: string[]
  description: string
  highlights: string[]
  isM?: boolean
  isElectric?: boolean
  isClassic?: boolean
}

export interface FilterState {
  series: string[]
  years: [number, number]
  priceRange: [number, number]
  horsepowerRange: [number, number]
  transmission: string[]
  fuelType: string[]
  bodyType: string[]
  search: string
}

export interface GarageSlot {
  id: string
  car: BMWVehicle | null
}

export type ViewMode = 'grid' | 'masonry' | 'fullscreen'

export interface LegacyEra {
  year: string
  title: string
  subtitle: string
  description: string
  image: string
  cars: string[]
}
