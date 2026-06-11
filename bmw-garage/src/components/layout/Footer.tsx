import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { FaInstagram, FaYoutube, FaTwitter, FaFacebook } from 'react-icons/fa6'
import { cn } from '../../utils/cn'

const columns = [
  {
    title: 'Models',
    links: ['3 Series', '5 Series', '7 Series', 'X5', 'X7', 'M Series'],
  },
  {
    title: 'Experience',
    links: ['Test Drive', 'Build Your Own', 'Financing', 'Service', 'BMW Museum'],
  },
  {
    title: 'Community',
    links: ['Events', 'BMW Club', 'Forums', 'Newsletter', 'Careers'],
  },
  {
    title: 'Connect',
    links: ['Contact Us', 'Dealer Locator', 'Support', 'App', 'My BMW'],
  },
]

const socialLinks = [
  { icon: FaInstagram, href: 'https://instagram.com/bmw', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://youtube.com/bmw', label: 'YouTube' },
  { icon: FaTwitter, href: 'https://twitter.com/bmw', label: 'Twitter' },
  { icon: FaFacebook, href: 'https://facebook.com/bmw', label: 'Facebook' },
]

const legalLinks = [
  'Legal Notice',
  'Privacy Policy',
  'Cookie Policy',
  'Terms of Use',
  'Imprint',
]

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <footer className="relative bg-carbon border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-8 md:px-12 lg:px-24">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-16 flex flex-wrap justify-between gap-12">
            <div className="max-w-xs">
              <Link to="/" className="group mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-sm bg-gradient-to-br from-bmw-blue to-bmw-blue-light" />
                <span className="text-base font-black tracking-[0.25em] text-white transition-colors group-hover:text-bmw-blue-light">
                  BMW GARAGE
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-white/40">
                The ultimate driving experience, curated. Explore, customize, and build your
                dream BMW collection.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
              {columns.map((col) => (
                <div key={col.title}>
                  <h4 className="mb-4 text-xs font-semibold tracking-[0.15em] uppercase text-white/50">
                    {col.title}
                  </h4>
                  <ul className="flex flex-col gap-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <span className="cursor-pointer text-sm text-white/40 transition-colors duration-200 hover:text-white">
                          {link}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-bmw-blue hover:text-bmw-blue hover:bg-bmw-blue/10"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 md:flex-row md:items-center">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} BMW Garage. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <span
                  key={link}
                  className={cn(
                    'cursor-pointer text-xs text-white/30 transition-colors duration-200 hover:text-white/60',
                  )}
                >
                  {link}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
