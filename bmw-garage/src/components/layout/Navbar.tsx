import { useState, useEffect, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiBars3, HiXMark } from 'react-icons/hi2'
import { cn } from '../../utils/cn'

const navLinks: { label: string; to: string }[] = [
  { label: 'Collection', to: '/collection' },
  { label: 'M Division', to: '/m-division' },
  { label: 'Garage', to: '/garage' },
  { label: 'Comparison', to: '/comparison' },
  { label: 'Community', to: '/community' },
]

const mobileVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30, staggerChildren: 0.06 },
  },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' as const } },
}

const linkVariants = {
  hidden: { x: 40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
}

function NavLinkItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }): ReactNode {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'relative tracking-widest text-xs uppercase transition-colors duration-300',
          'after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-bmw-blue after:transition-all after:duration-300',
          'hover:after:w-full',
          isActive ? 'text-white after:w-full' : 'text-white/60 hover:text-white',
        )
      }
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          scrolled
            ? 'bg-bmw-dark/80 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12 lg:px-24">
          <Link to="/" className="group flex items-center gap-2">
            <span className="h-6 w-6 rounded-sm bg-gradient-to-br from-bmw-blue to-bmw-blue-light" />
            <span className="text-base font-black tracking-[0.25em] text-white transition-colors group-hover:text-bmw-blue-light">
              BMW GARAGE
            </span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <NavLinkItem key={link.to} to={link.to} label={link.label} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center text-white/80 transition-colors hover:text-white md:hidden"
            aria-label="Open menu"
          >
            <HiBars3 size={28} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              variants={mobileVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-bmw-dark/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl md:hidden"
            >
              <div className="flex h-16 items-center justify-end px-6">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="text-white/80 transition-colors hover:text-white"
                  aria-label="Close menu"
                >
                  <HiXMark size={28} />
                </button>
              </div>

              <div className="flex flex-col gap-1 px-6">
                {navLinks.map((link) => (
                  <motion.div key={link.to} variants={linkVariants}>
                    <NavLinkItem to={link.to} label={link.label} onClick={() => setMenuOpen(false)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
