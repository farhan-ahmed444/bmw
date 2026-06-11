import { useRef, useState, type ReactNode } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { cn } from '../../utils/cn'

interface MarqueeProps {
  children: ReactNode
  direction?: 'left' | 'right'
  speed?: number
  className?: string
  pauseOnHover?: boolean
}

export default function Marquee({
  children,
  direction = 'left',
  speed = 30,
  className,
  pauseOnHover = true,
}: MarqueeProps) {
  const controls = useAnimationControls()
  const [isPaused, setIsPaused] = useState(false)
  const duration = 100 / speed

  const startAnimation = () => {
    controls.start({
      x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
      transition: { duration, ease: 'linear', repeat: Infinity },
    })
  }

  return (
    <div
      className={cn('overflow-hidden', className)}
      onMouseEnter={() => {
        if (pauseOnHover) {
          setIsPaused(true)
          controls.stop()
        }
      }}
      onMouseLeave={() => {
        if (pauseOnHover) {
          setIsPaused(false)
          startAnimation()
        }
      }}
    >
      <motion.div
        className="flex w-max"
        animate={controls}
        initial={false}
        onViewportEnter={startAnimation}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </motion.div>
    </div>
  )
}
