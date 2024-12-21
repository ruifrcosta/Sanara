import { classNames } from '../../utils/classNames'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export default function Card({
  children,
  className,
  noPadding = false,
  ...props
}: CardProps) {
  return (
    <div
      className={classNames(
        'bg-surface rounded-lg shadow',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

export function CardHeader({ title, description, action, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={classNames('flex items-center justify-between space-x-4', className)}
      {...props}
    >
      <div>
        <h3 className="text-lg font-medium text-primary">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-secondary">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean
}

export function CardContent({
  noPadding = false,
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div
      className={classNames(
        !noPadding && 'mt-6',
        'text-primary',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={classNames(
        'mt-6 flex items-center justify-end space-x-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 