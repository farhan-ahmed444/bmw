import { useRef, useState, useMemo, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiMessageCircle } from 'react-icons/fi'
import { bmwVehicles } from '../../data/bmwData'
import { cn } from '../../utils/cn'

interface CommunityPost {
  id: string
  user: { name: string; initials: string }
  car: (typeof bmwVehicles)[0]
  likes: number
  comments: number
  span: 'tall' | 'wide' | 'square'
}

const usernames = [
  '///M_Power', 'BavarianMotorist', 'e30_forever', 'V10_Howl',
  'NeueKlasse', 'TurboLag', 'CSL_Fanatic', 'KidneyGrillGang',
]

const spans: CommunityPost['span'][] = ['tall', 'square', 'wide', 'tall', 'square', 'wide', 'square', 'tall']

const communityPosts: CommunityPost[] = bmwVehicles.slice(0, 8).map((car, i) => ({
  id: `post-${car.id}`,
  user: {
    name: usernames[i],
    initials: usernames[i].slice(0, 2).toUpperCase(),
  },
  car,
  likes: Math.floor(Math.random() * 200) + 50,
  comments: Math.floor(Math.random() * 30) + 5,
  span: spans[i],
}))

export default function CommunityShowcase() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-carbon via-bmw-dark to-carbon pointer-events-none" />

      <div className="relative z-10">
        <div className="section-padding mb-14 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-bmw-blue font-medium tracking-[0.2em] text-sm mb-3"
          >
            COMMUNITY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Community{' '}
            <span className="text-gradient">Builds</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-white/40 text-lg max-w-xl"
          >
            Discover stunning builds shared by BMW enthusiasts around the world
          </motion.p>
        </div>

        <div className="section-padding columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {communityPosts.map((post, i) => (
            <CommunityCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CommunityCard({ post, index }: { post: CommunityPost; index: number }) {
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
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        'group relative overflow-hidden rounded-sm cursor-pointer break-inside-avoid',
        post.span === 'tall' ? 'aspect-[3/4]' : post.span === 'wide' ? 'aspect-[4/3]' : 'aspect-square',
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s ease',
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.08 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <img
          src={post.car.images[0]}
          alt={post.car.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-bmw-blue/80 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {post.user.initials}
          </div>
          <span className="text-sm font-medium text-white/90">{post.user.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-white/60 text-xs">
            <FiHeart className="w-3.5 h-3.5" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60 text-xs">
            <FiMessageCircle className="w-3.5 h-3.5" />
            <span>{post.comments}</span>
          </div>
        </div>
      </div>

      <motion.div
        className={cn(
          'absolute inset-0 pointer-events-none transition-opacity duration-300',
        )}
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered
            ? 'inset 0 0 0 1px rgba(0,102,177,0.4), 0 20px 60px rgba(0,0,0,0.5)'
            : 'inset 0 0 0 1px transparent, 0 0 0 transparent',
        }}
      />

      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
          'bg-gradient-to-tr from-bmw-blue/5 to-transparent',
        )}
      />
    </motion.div>
  )
}
