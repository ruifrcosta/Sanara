import { forwardRef } from 'react'
import { classNames } from '../../utils/classNames'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors'
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    }
    const variantStyles = {
      primary:
        'bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary/50 disabled:bg-primary/50',
      secondary:
        'bg-surface-variant text-text-primary hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 disabled:bg-gray-100',
      outline:
        'border border-border-color text-text-primary hover:bg-surface-variant focus:ring-2 focus:ring-primary/50 disabled:bg-surface-variant',
      ghost:
        'text-text-primary hover:bg-surface-variant focus:ring-2 focus:ring-primary/50 disabled:bg-transparent',
      danger:
        'bg-error text-white hover:bg-error-dark focus:ring-2 focus:ring-error/50 disabled:bg-error/50',
    }

    return (
      <button
        ref={ref}
        className={classNames(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          'disabled:cursor-not-allowed',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button 