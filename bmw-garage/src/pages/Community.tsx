import { useRef, useState, useMemo, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiMessageCircle, FiCamera, FiUsers, FiGrid } from 'react-icons/fi'
import { cn } from '../utils/cn'
import { bmwVehicles } from '../data/bmwData'

const usernames = [
  '///M_Power', 'BavarianMotorist', 'e30_forever', 'V10_Howl',
  'NeueKlasse', 'TurboLag', 'CSL_Fanatic', 'KidneyGrillGang',
  'DriftKing', 'BimmerLife', 'M_Performance', 'E36_Slayer',
]

const collections = [
  { name: 'M Series Only', cars: bmwVehicles.filter((v) => v.category === 'M Series').slice(0, 4), user: '///M_Power', count: 12 },
  { name: 'Electric Dreams', cars: bmwVehicles.filter((v) => v.category === 'Electric').slice(0, 4), user: 'NeueKlasse', count: 8 },
  { name: 'Vintage Classics', cars: bmwVehicles.filter((v) => v.category === 'Classic').slice(0, 4), user: 'e30_forever', count: 15 },
  { name: 'Ultimate Garage', cars: bmwVehicles.slice(0, 4), user: 'BimmerLife', count: 20 },
]

const photographyTags = ['Motion Blur', 'Golden Hour', 'Studio', 'Track Day', 'Night Shoot', 'Drift']

export default function Community() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-bmw-dark"
    >
      <div className="section-padding pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Community <span className="text-gradient">Hub</span>
            </h1>
            <p className="mt-3 text-white/50 text-base md:text-lg max-w-2xl">
              Discover builds, photography, and collections shared by BMW enthusiasts worldwide.
            </p>
          </motion.div>
        </div>
      </div>

      <FeaturedBuilds />

      <PhotographySection />

      <UserCollectionsSection />
    </motion.main>
  )
}

function FeaturedBuilds() {
  const posts = useMemo(
    () =>
      bmwVehicles.slice(0, 12).map((car, i) => ({
        id: `build-${car.id}`,
        user: {
          name: usernames[i % usernames.length],
          initials: usernames[i % usernames.length].slice(0, 2).toUpperCase(),
        },
        car,
        likes: Math.floor(Math.random() * 300) + 80,
        comments: Math.floor(Math.random() * 40) + 8,
      })),
    [],
  )

  return (
    <section className="section-padding pb-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <FiGrid className="w-5 h-5 text-bmw-blue" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Featured Builds</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {posts.map((post, i) => (
            <TiltCard key={post.id} index={i}>
              <div className="absolute inset-0">
                <img
                  src={post.car.images[0]}
                  alt={post.car.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-bmw-blue/80 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {post.user.initials}
                  </div>
                  <span className="text-sm font-medium text-white/90">{post.user.name}</span>
                </div>
                <p className="text-base font-semibold text-white mb-2">{post.car.name}</p>
                <div className="flex items-center gap-4 text-white/50 text-xs">
                  <span className="flex items-center gap-1">
                    <FiHeart className="w-3.5 h-3.5" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMessageCircle className="w-3.5 h-3.5" /> {post.comments}
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function PhotographySection() {
  const photos = useMemo(
    () =>
      bmwVehicles.slice(4, 10).map((car, i) => ({
        id: `photo-${car.id}`,
        car,
        tag: photographyTags[i % photographyTags.length],
      })),
    [],
  )

  return (
    <section className="section-padding pb-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <FiCamera className="w-5 h-5 text-bmw-blue" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Photography</h2>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {photos.map((photo, i) => (
            <TiltCard key={photo.id} index={i}>
              <div className="absolute inset-0">
                <img
                  src={photo.car.images[1] || photo.car.images[0]}
                  alt={photo.car.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="glass-strong px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white/80">
                  {photo.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm font-medium text-white">{photo.car.name}</p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  by {usernames[i % usernames.length]}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function UserCollectionsSection() {
  return (
    <section className="section-padding pb-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <FiUsers className="w-5 h-5 text-bmw-blue" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">User Collections</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-xl overflow-hidden group"
            >
              <div className="grid grid-cols-2 h-48">
                {col.cars.map((car, ci) => (
                  <div key={car.id} className="relative overflow-hidden">
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 drop-shadow-md">
                      {car.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{col.name}</h3>
                    <p className="text-sm text-white/50 mt-0.5">
                      by {col.user} &middot; {col.count} cars
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-bmw-blue">
                    <FiHeart className="w-4 h-4" />
                    <span className="text-xs font-medium">{Math.floor(Math.random() * 500 + 100)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TiltCard({ children, index }: { children: React.ReactNode; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setRotate({ x: -y * 8, y: x * 8 })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-sm cursor-pointer break-inside-avoid aspect-square"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease',
      }}
    >
      {children}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered
            ? 'inset 0 0 0 1px rgba(0,102,177,0.4), 0 20px 60px rgba(0,0,0,0.5)'
            : 'inset 0 0 0 1px transparent, 0 0 0 transparent',
        }}
      />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-tr from-bmw-blue/5 to-transparent" />
    </motion.div>
  )
}
