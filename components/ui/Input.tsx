import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-espresso-800 dark:text-cream-200">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`
          w-full px-3 py-2.5 rounded-lg text-sm
          bg-white dark:bg-espresso-800
          border border-stone-200 dark:border-espresso-700
          text-espresso-900 dark:text-cream-100
          placeholder:text-stone-400 dark:placeholder:text-stone-500
          focus:outline-none focus:ring-2 focus:ring-caramel-400 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-shadow duration-150
          ${error ? 'border-red-400 focus:ring-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
)

Input.displayName = 'Input'
export default Input
