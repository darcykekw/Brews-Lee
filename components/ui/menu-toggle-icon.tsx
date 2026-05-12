'use client'

interface MenuToggleIconProps {
  open: boolean
  className?: string
}

export default function MenuToggleIcon({ open, className = 'w-5 h-5' }: MenuToggleIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      {/* Top line: rotates to first arm of X */}
      <line
        x1="3" y1="6" x2="21" y2="6"
        style={{
          transformOrigin: '12px 6px',
          transition: 'transform 0.25s ease',
          transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
        }}
      />
      {/* Middle line: fades out */}
      <line
        x1="3" y1="12" x2="21" y2="12"
        style={{
          transition: 'opacity 0.2s ease',
          opacity: open ? 0 : 1,
        }}
      />
      {/* Bottom line: rotates to second arm of X */}
      <line
        x1="3" y1="18" x2="21" y2="18"
        style={{
          transformOrigin: '12px 18px',
          transition: 'transform 0.25s ease',
          transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
        }}
      />
    </svg>
  )
}
