import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 shrink-0 rounded border border-primary shadow transition-all',
            'peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            'peer-checked:bg-primary peer-checked:text-primary-foreground',
            'flex items-center justify-center',
            className
          )}
        >
          <Check className="h-3.5 w-3.5 opacity-0 transition-opacity peer-checked:opacity-100" />
        </div>
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
