import { useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ScrollTriggerOptions = {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  markers?: boolean
  toggleActions?: string
  [key: string]: unknown
}

type AnimationOptions = {
  scrollTrigger?: ScrollTriggerOptions
  [key: string]: unknown
}

export function useScrollAnimations() {
  const animateTextReveal = useCallback(
    (element: string | Element, delay: number = 0) => {
      const chars = gsap.utils.toArray(
        `${element instanceof Element ? '' : element} .char`
      )
      gsap.fromTo(
        chars,
        { y: 80, opacity: 0, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.04,
          delay,
          ease: 'power4.out',
        }
      )
    },
    []
  )

  const animateFromTo = useCallback(
    (
      element: string | Element,
      fromVars: gsap.TweenVars,
      toVars: gsap.TweenVars,
      options: AnimationOptions = {}
    ) => {
      return gsap
        .fromTo(element, fromVars, {
          ...toVars,
          scrollTrigger: {
            trigger: element as Element,
            start: 'top 85%',
            end: 'top 20%',
            scrub: 1,
            ...options.scrollTrigger,
          },
        })
        .play()
    },
    []
  )

  const animateCounter = useCallback(
    (
      element: string | Element,
      from: number,
      to: number,
      duration: number = 2
    ) => {
      return gsap.fromTo(
        element,
        { innerText: from },
        {
          innerText: to,
          duration,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: element as Element,
            start: 'top 85%',
          },
        }
      )
    },
    []
  )

  const createTimeline = useCallback(
    (triggers: { element: string | Element; vars: gsap.TweenVars }[]) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggers[0]?.element as Element,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 1,
        },
      })

      triggers.forEach(({ element, vars }) => {
        tl.fromTo(element, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ...vars }, '<')
      })

      return tl
    },
    []
  )

  return { animateTextReveal, animateFromTo, animateCounter, createTimeline }
}
