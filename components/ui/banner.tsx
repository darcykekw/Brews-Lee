'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

/* ── Variants ──────────────────────────────────────────────────────────── */
const bannerVariants = cva(
  // base
  'w-full flex items-center justify-center gap-3 px-10 py-2.5 text-sm font-medium text-center leading-snug relative',
  {
    variants: {
      variant: {
        normal: '',
        rainbow: 'animate-gradient bg-[length:200%_200%]',
      },
    },
    defaultVariants: { variant: 'normal' },
  }
)

/* ── Types ─────────────────────────────────────────────────────────────── */
interface BannerProps extends VariantProps<typeof bannerVariants> {
  id?: string
  message: string
  asChild?: boolean
  className?: string
}

/* ── Component ─────────────────────────────────────────────────────────── */
export function Banner({ id = 'brews-lee-promo', message, variant = 'normal', asChild, className }: BannerProps) {
  const [visible, setVisible] = useState(false)

  // Use message content as part of the storage key so a new message always shows fresh
  const storageKey = `${id}-${message.trim().slice(0, 60)}`

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(storageKey)
      if (!dismissed) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [storageKey])

  function dismiss() {
    try {
      localStorage.setItem(storageKey, '1')
    } catch { /* ignore */ }
    setVisible(false)
  }

  if (!visible) return null

  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={bannerVariants({ variant, className })}
      style={
        variant === 'normal'
          ? { backgroundColor: '#EFE9E3', color: '#1C1209', borderBottom: '1px solid #D9CFC7' }
          : undefined
      }
    >
      {/* Message */}
      <span className="flex-1 text-center">{message}</span>

      {/* Dismiss button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full transition-colors hover:bg-black/5"
        style={{ color: '#C9B59C' }}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </Comp>
  )
}

export default Banner
