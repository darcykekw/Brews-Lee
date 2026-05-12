import * as React from 'react'
import { clsx } from 'clsx'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx('block text-sm font-medium leading-none', className)}
      style={{ color: '#1C1209' }}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5" style={{ color: '#C9B59C' }}>*</span>}
    </label>
  )
)
Label.displayName = 'Label'

export { Label }
