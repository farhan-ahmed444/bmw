import { motion } from 'framer-motion'
import ComparisonTool from '../components/comparison/ComparisonTool'

export default function Comparison() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-bmw-dark"
    >
      <div className="section-padding pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Compare <span className="text-gradient">Models</span>
            </h1>
            <p className="mt-3 text-white/50 text-base md:text-lg max-w-2xl">
              Select up to 3 BMWs and compare their specs side by side to find your perfect match.
            </p>
          </motion.div>
        </div>
      </div>

      <ComparisonTool />
    </motion.main>
  )
}
