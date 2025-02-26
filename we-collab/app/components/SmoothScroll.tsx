'use client'

import { useEffect, useRef } from 'react'
import LocomotiveScroll from 'locomotive-scroll'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRef.current) return

    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1,
      class: 'is-revealed',
    })

    return () => {
      scroll.destroy()
    }
  }, [])

  return <div ref={scrollRef}>{children}</div>
}

