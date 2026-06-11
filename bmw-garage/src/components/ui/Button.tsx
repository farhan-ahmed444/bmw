import { forwardRef, useRef, useState, type ElementType, type ReactNode, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'm'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  icon?: ReactNode
  className?: string
  href?: string
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  disabled?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-bmw-blue text-white hover:bg-bmw-blue-light border border-transparent',
  outline: 'bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5',
  ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/10 border border-transparent',
  m: 'bg-gradient-to-r from-[#1C69D4] via-[#E31C28] to-[#00A3E0] text-white border border-transparent',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-xs gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2.5',
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, icon, className, href, onClick, disabled = false }, ref) => {
    const buttonRef = useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height
      setMousePos({ x, y })
    }

    const content = (
      <motion.div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }) }}
        animate={{
          x: mousePos.x * (isHovered ? 6 : 0),
          y: mousePos.y * (isHovered ? 6 : 0),
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        className={cn(
          'relative inline-flex items-center justify-center font-medium tracking-wider uppercase transition-colors duration-300 rounded-sm cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bmw-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bmw-dark',
          disabled && 'opacity-40 pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
        )}
      >
        <motion.span
          className="relative z-10 flex items-center gap-2"
          animate={{ scale: isHovered ? 1.02 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </motion.span>
        <motion.span
          className="absolute inset-0 rounded-sm"
          animate={{
            boxShadow: isHovered
              ? variant === 'primary'
                ? '0 0 25px rgba(0,102,177,0.5), inset 0 0 25px rgba(0,102,177,0.1)'
                : variant === 'm'
                  ? '0 0 25px rgba(227,28,40,0.4), inset 0 0 25px rgba(227,28,40,0.1)'
                  : '0 0 20px rgba(255,255,255,0.15)'
              : '0 0 0px transparent',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    )

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          onClick={onClick}
          className={cn('inline-block', disabled && 'pointer-events-none', className)}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn('inline-block', className)}
      >
        {content}
      </button>
    )
  },
)

Button.displayName = 'Button'
export default Button
