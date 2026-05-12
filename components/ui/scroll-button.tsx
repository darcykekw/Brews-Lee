'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

interface ScrollButtonProps {
  direction: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
  className?: string
}

export function ScrollButton({ direction, onClick, disabled, className }: ScrollButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      className={clsx(
        'flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all duration-150',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        className
      )}
      style={{
        backgroundColor: '#EFE9E3',
        border: '1px solid #D9CFC7',
        color: '#1C1209',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = '#D9CFC7'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#EFE9E3'
      }}
    >
      {direction === 'left'
        ? <ChevronLeft size={16} strokeWidth={2} />
        : <ChevronRight size={16} strokeWidth={2} />}
    </button>
  )
}

export default ScrollButton
