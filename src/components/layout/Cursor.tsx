import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const isHovering = useRef(false)

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })
  const scale = useSpring(1, { stiffness: 400, damping: 25 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.closest('a, button, [data-cursor], input, textarea, select') !== null
      if (isInteractive !== isHovering.current) {
        isHovering.current = isInteractive
        scale.set(isInteractive ? 2.5 : 1)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
    }
  }, [mouseX, mouseY, scale])

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full border border-white/30 bg-white/10 shadow-[0_0_20px_rgba(0,102,177,0.3)] backdrop-blur-sm md:block"
      style={{
        x: springX,
        y: springY,
        scale,
        translateX: '-50%',
        translateY: '-50%',
        width: 20,
        height: 20,
      }}
    />
  )
}
