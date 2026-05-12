'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { ScrollButton } from './scroll-button'

interface ScrollerProps {
  children: React.ReactNode
  overflow?: 'x' | 'y' | 'both'
  withButtons?: boolean
  scrollAmount?: number
  className?: string
  containerClassName?: string
}

export function Scroller({
  children,
  overflow = 'x',
  withButtons = false,
  scrollAmount = 320,
  className,
  containerClassName,
}: ScrollerProps) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', update); ro.disconnect() }
  }, [update])

  function scroll(dir: 'left' | 'right') {
    trackRef.current?.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  const isX = overflow === 'x' || overflow === 'both'
  const isY = overflow === 'y' || overflow === 'both'

  return (
    <div className={clsx('relative', className)}>
      {/* Left edge gradient — uses CSS var so it adapts to dark mode automatically */}
      {isX && (
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-14 z-10"
          style={{ background: 'linear-gradient(to right, var(--color-base, #F9F8F6), transparent)' }}
        />
      )}

      {/* Right edge gradient */}
      {isX && (
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-14 z-10"
          style={{ background: 'linear-gradient(to left, var(--color-base, #F9F8F6), transparent)' }}
        />
      )}

      {/* Left scroll button */}
      {withButtons && isX && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 z-20">
          <ScrollButton direction="left" onClick={() => scroll('left')} disabled={!canLeft} />
        </div>
      )}

      {/* Right scroll button */}
      {withButtons && isX && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 z-20">
          <ScrollButton direction="right" onClick={() => scroll('right')} disabled={!canRight} />
        </div>
      )}

      {/* Scroll track */}
      <div
        ref={trackRef}
        className={clsx(
          'flex gap-4',
          isX && 'overflow-x-auto',
          isY && 'overflow-y-auto',
          // hide native scrollbar
          '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          containerClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Scroller
