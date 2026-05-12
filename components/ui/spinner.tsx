import { clsx } from 'clsx'

interface SpinnerProps {
  size?: number
  className?: string
}

export function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className={clsx(
        'inline-block rounded-full border-2 border-current border-t-transparent animate-spin',
        className
      )}
    />
  )
}

export default Spinner
