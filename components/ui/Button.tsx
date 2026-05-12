import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-caramel-500 hover:bg-caramel-600 text-white shadow-sm',
  secondary: 'border border-espresso-900 dark:border-cream-200 text-espresso-900 dark:text-cream-100 hover:bg-espresso-900 hover:text-white dark:hover:bg-cream-100 dark:hover:text-espresso-900',
  ghost: 'text-espresso-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-espresso-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-sm px-4 py-2 rounded-lg',
  lg: 'text-base px-6 py-3 rounded-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-150 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-caramel-400 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
)

Button.displayName = 'Button'
export default Button
