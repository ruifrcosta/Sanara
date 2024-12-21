import { ComponentType, SVGProps } from 'react'
import Card from '../ui/Card'

interface ActivityItem {
  id: number
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  description: string
  timestamp: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  user?: {
    name: string
    imageUrl: string
  }
}

interface ActivityListProps {
  items: ActivityItem[]
  maxItems?: number
}

const typeStyles = {
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  error: 'bg-error text-white',
  info: 'bg-info text-white',
}

export default function ActivityList({ items, maxItems = 5 }: ActivityListProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items

  return (
    <Card>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-text-primary">
          Atividade Recente
        </h3>
        <div className="mt-6 flow-root">
          <ul role="list" className="-mb-8">
            {displayItems.map((item, itemIdx) => (
              <li key={item.id}>
                <div className="relative pb-8">
                  {itemIdx !== displayItems.length - 1 ? (
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border-color"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div
                      className={`relative rounded-lg p-2 ${
                        typeStyles[item.type]
                      }`}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-text-primary">
                          {item.title}
                        </p>
                        <p className="text-sm text-text-tertiary">
                          {item.timestamp}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-text-secondary">
                        {item.description}
                      </p>
                      {item.user && (
                        <div className="mt-2 flex items-center space-x-2">
                          <img
                            className="h-6 w-6 rounded-full"
                            src={item.user.imageUrl}
                            alt=""
                          />
                          <span className="text-sm text-text-tertiary">
                            {item.user.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {items.length > maxItems && (
            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                Ver todas as atividades
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 