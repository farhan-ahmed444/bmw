import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { categories } from '../../data/bmwData'
import { cn } from '../../utils/cn'

const rowSpans = [1, 2, 1, 2, 1, 1, 2, 1, 2, 1]

export default function CategoriesShowcase() {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-carbon via-transparent to-carbon pointer-events-none" />

      <div className="relative z-10">
        <div className="section-padding mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-bmw-blue font-medium tracking-[0.2em] text-sm mb-3"
          >
            EXPLORE BY CATEGORY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Find Your Perfect{' '}
            <span className="text-gradient">BMW</span>
          </motion.h2>
        </div>

        <div className="section-padding grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-[260px]">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={cn(
                'relative overflow-hidden rounded-sm cursor-pointer group',
                rowSpans[i] === 2 && 'md:row-span-2 md:h-full',
              )}
              onClick={() => navigate(`/collection?category=${cat.id}`)}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="absolute inset-0 bg-carbon">
                {cat.image ? (
                  <motion.img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    animate={{ scale: hoveredId === cat.id ? 1.08 : 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-bmw-blue/20 to-carbon flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/5 select-none">{cat.name[0]}</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-4 right-4">
                <span className="glass-strong px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-white/90 block">
                  {cat.count} MODELS
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {cat.name}
                </h3>
              </div>

              <motion.div
                className="absolute inset-0 flex items-end p-4"
                initial={false}
                animate={{
                  opacity: hoveredId === cat.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass rounded-sm p-4 w-full">
                  <p className="text-sm text-white/90 leading-relaxed">{cat.description}</p>
                </div>
              </motion.div>

              <div
                className={cn(
                  'absolute inset-0 border border-bmw-blue/0 transition-colors duration-300 rounded-sm pointer-events-none',
                  hoveredId === cat.id && 'border-bmw-blue/50',
                )}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
