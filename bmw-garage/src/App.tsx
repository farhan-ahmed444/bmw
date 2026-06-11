import { useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Cursor from './components/layout/Cursor'
import ScrollProgress from './components/layout/ScrollProgress'
import Home from './pages/Home'
import Collection from './pages/Collection'
import ModelDetail from './pages/ModelDetail'
import Garage from './pages/Garage'
import Comparison from './pages/Comparison'
import Community from './pages/Community'

gsap.registerPlugin(ScrollTrigger)

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <ScrollProgress />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.08 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => { lenis.destroy(); gsap.ticker.remove(lenis.raf); lenisRef.current = null }
  }, [])

  return (
    <BrowserRouter>
      <Cursor />
      <Routes>
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/collection" element={<AppLayout><Collection /></AppLayout>} />
        <Route path="/model/:id" element={<><Navbar /><ModelDetail /><Footer /></>} />
        <Route path="/garage" element={<AppLayout><Garage /></AppLayout>} />
        <Route path="/comparison" element={<AppLayout><Comparison /></AppLayout>} />
        <Route path="/community" element={<AppLayout><Community /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
