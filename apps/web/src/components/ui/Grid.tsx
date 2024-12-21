import { HTMLAttributes } from 'react'
import { classNames } from '../../utils/classNames'

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 4 | 6 | 8 | 12
  colsTablet?: 1 | 2 | 3 | 4 | 6 | 8
  colsMobile?: 1 | 2 | 3 | 4
}

export default function Grid({
  cols = 12,
  gap = 6,
  colsTablet,
  colsMobile,
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={classNames(
        'grid',
        // Desktop
        cols === 1 && 'grid-cols-1',
        cols === 2 && 'grid-cols-2',
        cols === 3 && 'grid-cols-3',
        cols === 4 && 'grid-cols-4',
        cols === 6 && 'grid-cols-6',
        cols === 12 && 'grid-cols-12',
        // Tablet
        colsTablet === 1 && 'md:grid-cols-1',
        colsTablet === 2 && 'md:grid-cols-2',
        colsTablet === 3 && 'md:grid-cols-3',
        colsTablet === 4 && 'md:grid-cols-4',
        colsTablet === 6 && 'md:grid-cols-6',
        colsTablet === 8 && 'md:grid-cols-8',
        // Mobile
        colsMobile === 1 && 'sm:grid-cols-1',
        colsMobile === 2 && 'sm:grid-cols-2',
        colsMobile === 3 && 'sm:grid-cols-3',
        colsMobile === 4 && 'sm:grid-cols-4',
        // Gap
        gap === 2 && 'gap-2',
        gap === 4 && 'gap-4',
        gap === 6 && 'gap-6',
        gap === 8 && 'gap-8',
        gap === 12 && 'gap-12',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12
  colSpanTablet?: 1 | 2 | 3 | 4 | 6 | 8
  colSpanMobile?: 1 | 2 | 3 | 4
}

export function GridItem({
  colSpan = 1,
  colSpanTablet,
  colSpanMobile,
  className,
  children,
  ...props
}: GridItemProps) {
  return (
    <div
      className={classNames(
        // Desktop
        colSpan === 1 && 'col-span-1',
        colSpan === 2 && 'col-span-2',
        colSpan === 3 && 'col-span-3',
        colSpan === 4 && 'col-span-4',
        colSpan === 6 && 'col-span-6',
        colSpan === 12 && 'col-span-12',
        // Tablet
        colSpanTablet === 1 && 'md:col-span-1',
        colSpanTablet === 2 && 'md:col-span-2',
        colSpanTablet === 3 && 'md:col-span-3',
        colSpanTablet === 4 && 'md:col-span-4',
        colSpanTablet === 6 && 'md:col-span-6',
        colSpanTablet === 8 && 'md:col-span-8',
        // Mobile
        colSpanMobile === 1 && 'sm:col-span-1',
        colSpanMobile === 2 && 'sm:col-span-2',
        colSpanMobile === 3 && 'sm:col-span-3',
        colSpanMobile === 4 && 'sm:col-span-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  noPadding?: boolean
}

export function Container({
  maxWidth = 'xl',
  noPadding = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={classNames(
        'mx-auto w-full',
        maxWidth === 'sm' && 'max-w-screen-sm',
        maxWidth === 'md' && 'max-w-screen-md',
        maxWidth === 'lg' && 'max-w-screen-lg',
        maxWidth === 'xl' && 'max-w-screen-xl',
        maxWidth === '2xl' && 'max-w-screen-2xl',
        !noPadding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 