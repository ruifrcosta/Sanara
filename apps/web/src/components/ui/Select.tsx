import { forwardRef } from 'react'
import { classNames } from '../../utils/classNames'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  fullWidth?: boolean
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      fullWidth = false,
      placeholder,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const selectStyles = classNames(
      'block rounded-lg border-border-color bg-surface text-text-primary',
      'focus:border-primary focus:ring-primary focus:ring-2',
      'disabled:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-75',
      error
        ? 'border-error text-error focus:border-error focus:ring-error'
        : 'border-border-color',
      fullWidth && 'w-full',
      className
    )

    return (
      <div className={classNames('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={selectStyles}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select'

export default Select 