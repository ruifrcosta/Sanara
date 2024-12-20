import { forwardRef } from 'react'
import { classNames } from '../../utils/classNames'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  helperText?: string
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      helperText,
      fullWidth = false,
      type = 'text',
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputWrapperStyles = classNames(
      'relative rounded-lg shadow-sm',
      fullWidth && 'w-full'
    )

    const inputStyles = classNames(
      'block rounded-lg border-border-color bg-surface text-text-primary placeholder:text-text-tertiary',
      'focus:border-primary focus:ring-primary focus:ring-2',
      'disabled:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-75',
      error
        ? 'border-error text-error focus:border-error focus:ring-error'
        : 'border-border-color',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      fullWidth && 'w-full',
      className
    )

    const iconStyles = 'absolute inset-y-0 flex items-center pointer-events-none text-text-tertiary'

    return (
      <div className={classNames('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className={inputWrapperStyles}>
          {leftIcon && <div className={classNames(iconStyles, 'left-3')}>{leftIcon}</div>}
          <input
            ref={ref}
            type={type}
            className={inputStyles}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {rightIcon && <div className={classNames(iconStyles, 'right-3')}>{rightIcon}</div>}
        </div>
        {(error || helperText) && (
          <p
            className={classNames(
              'text-sm',
              error ? 'text-error' : 'text-text-tertiary'
            )}
            id={error ? `${props.id}-error` : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input 