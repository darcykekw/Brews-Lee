import * as React from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  characterCount?: number
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, characterCount, maxLength, ...props }, ref) => (
    <div className="relative">
      <textarea
        ref={ref}
        rows={3}
        className={clsx(
          'w-full resize-none rounded-xl px-3.5 py-2.5 text-sm outline-none transition-shadow',
          'placeholder:text-[#A89E95]',
          className
        )}
        style={{
          backgroundColor: '#EFE9E3',
          border: '1.5px solid #D9CFC7',
          color: '#1C1209',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#C9B59C' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#D9CFC7' }}
        maxLength={maxLength}
        {...props}
      />
      {maxLength !== undefined && characterCount !== undefined && (
        <p
          className="absolute bottom-2 right-3 text-[11px] select-none pointer-events-none"
          style={{ color: characterCount >= maxLength ? '#C9B59C' : '#A89E95' }}
        >
          {characterCount}/{maxLength}
        </p>
      )}
    </div>
  )
)
Textarea.displayName = 'Textarea'

export { Textarea }
