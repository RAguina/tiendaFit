import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-200 focus-visible:ring-gray-950',
        error: 'border-red-500 focus-visible:ring-red-500',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3 py-1',
        lg: 'h-11 px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    type, 
    label, 
    error, 
    helperText, 
    startIcon, 
    endIcon, 
    id,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperTextId = `${inputId}-helper`

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400 h-4 w-4">
                {startIcon}
              </div>
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ 
                variant: error ? 'error' : variant, 
                size, 
                className 
              }),
              startIcon && 'pl-10',
              endIcon && 'pr-10'
            )}
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-gray-400 h-4 w-4">
                {endIcon}
              </div>
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperTextId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }