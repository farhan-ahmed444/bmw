import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { cn } from '../../utils/cn'
import type { BMWVehicle } from '../../types'

interface RadarChartProps {
  cars: BMWVehicle[]
  labels: string[]
  getValue: (car: BMWVehicle, axisIndex: number) => number
  className?: string
}

const COLORS = ['#0066B1', '#E31C28', '#00A3E0', '#C0C0C0', '#FF8C00']

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

export default function RadarChart({ cars, labels, getValue, className }: RadarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      const size = Math.min(width, 500)
      setDimensions({ width: size, height: size })
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  const { width, height } = dimensions
  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) * 0.35
  const levels = 5

  const maxValues = labels.map((_, i) => {
    let max = 0
    for (const car of cars) {
      const val = getValue(car, i)
      if (val > max) max = val
    }
    return max || 1
  })

  const normalized = cars.map((car) =>
    labels.map((_, i) => getValue(car, i) / maxValues[i]),
  )

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const polygons = svg.querySelectorAll<SVGPolygonElement>('[data-radar-polygon]')
    gsap.fromTo(
      Array.from(polygons),
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        transformOrigin: `${cx}px ${cy}px`,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      },
    )
  }, [cars, labels, cx, cy])

  if (cars.length === 0) return null

  const gridLines: React.ReactNode[] = []
  for (let level = 1; level <= levels; level++) {
    const r = (radius / levels) * level
    const pts = labels
      .map((_, i) => {
        const angle = (360 / labels.length) * i
        const p = polarToCartesian(cx, cy, r, angle)
        return `${p.x},${p.y}`
      })
      .join(' ')
    gridLines.push(<polygon key={`grid-${level}`} points={pts} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />)
  }

  const axes: React.ReactNode[] = []
  labels.forEach((_, i) => {
    const angle = (360 / labels.length) * i
    const end = polarToCartesian(cx, cy, radius, angle)
    axes.push(
      <line key={`axis-${i}`} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />,
    )
  })

  const labelNodes: React.ReactNode[] = []
  labels.forEach((label, i) => {
    const angle = (360 / labels.length) * i
    const pos = polarToCartesian(cx, cy, radius + 24, angle)
    labelNodes.push(
      <text
        key={`label-${i}`}
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize={10}
        fontFamily="inherit"
      >
        {label}
      </text>,
    )
  })

  const polygons = cars.map((car, ci) => {
    const pts = labels
      .map((_, i) => {
        const r = normalized[ci][i] * radius
        const angle = (360 / labels.length) * i
        const p = polarToCartesian(cx, cy, r, angle)
        return `${p.x},${p.y}`
      })
      .join(' ')
    return (
      <polygon
        key={`poly-${ci}`}
        data-radar-polygon
        points={pts}
        fill={COLORS[ci % COLORS.length]}
        fillOpacity={0.12}
        stroke={COLORS[ci % COLORS.length]}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    )
  })

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="w-full h-auto"
      >
        {gridLines}
        {axes}
        {labelNodes}
        {polygons}
      </svg>
      <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
        {cars.map((car, ci) => (
          <div key={car.id} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[ci % COLORS.length] }}
            />
            <span className="text-xs text-white/60">{car.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
