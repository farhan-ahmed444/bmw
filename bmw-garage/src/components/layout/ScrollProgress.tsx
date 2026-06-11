import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const progress = useMotionValue(0)
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const onScroll = () => {
      const docEl = document.documentElement
      const scrollTop = docEl.scrollTop
      const scrollHeight = docEl.scrollHeight - docEl.clientHeight
      progress.set(scrollHeight > 0 ? scrollTop / scrollHeight : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [progress])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left bg-gradient-to-r from-bmw-blue via-bmw-blue-light to-[#00A3E0]"
      style={{ scaleX: smoothProgress }}
    />
  )
}
