'use client'

import { useEffect, useRef, useState } from 'react'
//useRef contient l'élement à observer
export function useSceneVisibility() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const preference = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)
    updatePreference()
    preference.addEventListener('change', updatePreference)

    // On charge une scène à sa première apparition et on la garde ensuite montée.
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
      if (entry.isIntersecting) setHasBeenVisible(true)
    })
    observer.observe(container)

    return () => {
      preference.removeEventListener('change', updatePreference)
      observer.disconnect()
    }
  }, [])

  return { containerRef, hasBeenVisible, isVisible, reducedMotion }
}
