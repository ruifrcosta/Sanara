import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import Card from '../ui/Card'

interface StatItem {
  name: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description?: string
}

interface StatsProps {
  items: StatItem[]
  columns?: 2 | 3 | 4
}

export default function Stats({ items, columns = 3 }: StatsProps) {
  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-${columns}`}>
      {items.map((item) => (
        <Card key={item.name}>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-md bg-primary p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-text-secondary">
                    {item.name}
                  </dt>
                  <dd>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-text-primary">
                        {item.value}
                      </p>
                      <p
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          item.changeType === 'increase'
                            ? 'text-success'
                            : 'text-error'
                        }`}
                      >
                        {item.changeType === 'increase' ? (
                          <ArrowUpIcon
                            className="h-5 w-5 flex-shrink-0 self-center text-success"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowDownIcon
                            className="h-5 w-5 flex-shrink-0 self-center text-error"
                            aria-hidden="true"
                          />
                        )}
                        <span className="sr-only">
                          {item.changeType === 'increase' ? 'Aumentou' : 'Diminuiu'} por
                        </span>
                        {item.change}
                      </p>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-text-tertiary">
                        {item.description}
                      </p>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 