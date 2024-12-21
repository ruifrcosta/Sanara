import { useMemo, useState } from 'react'
import { ChartData } from 'chart.js'
import Chart from './Chart'
import Card from '../ui/Card'
import DateRangeFilter from './DateRangeFilter'

interface SatisfactionData {
  date: string
  rating: number
  totalReviews: number
  categories: {
    excellent: number
    good: number
    average: number
    poor: number
  }
  details?: {
    doctor: string
    specialty: string
    comment?: string
  }
}

interface SatisfactionChartProps {
  data: SatisfactionData[]
  view?: 'trend' | 'distribution'
  onDrillDown?: (date: string) => void
}

export default function SatisfactionChart({
  data,
  view = 'trend',
  onDrillDown,
}: SatisfactionChartProps) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  const filteredData = useMemo(() => {
    return data.filter(
      (item) => item.date >= dateRange.startDate && item.date <= dateRange.endDate
    )
  }, [data, dateRange])

  const chartData = useMemo(() => {
    if (view === 'trend') {
      const chartData: ChartData<'line'> = {
        labels: filteredData.map((item) => {
          const date = new Date(item.date)
          return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
        }),
        datasets: [
          {
            label: 'Avaliação Média',
            data: filteredData.map((item) => item.rating),
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            yAxisID: 'y',
          },
          {
            label: 'Total de Avaliações',
            data: filteredData.map((item) => item.totalReviews),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            yAxisID: 'y1',
          },
        ],
      }
      return chartData
    } else {
      // Calcular totais para distribuição
      const totals = filteredData.reduce(
        (acc, item) => {
          acc.excellent += item.categories.excellent
          acc.good += item.categories.good
          acc.average += item.categories.average
          acc.poor += item.categories.poor
          return acc
        },
        { excellent: 0, good: 0, average: 0, poor: 0 }
      )

      const total = Object.values(totals).reduce((a, b) => a + b, 0)

      const chartData: ChartData<'doughnut'> = {
        labels: ['Excelente', 'Bom', 'Regular', 'Ruim'],
        datasets: [
          {
            data: [
              (totals.excellent / total) * 100,
              (totals.good / total) * 100,
              (totals.average / total) * 100,
              (totals.poor / total) * 100,
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(99, 102, 241, 0.8)',
              'rgba(234, 179, 8, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(99, 102, 241)',
              'rgb(234, 179, 8)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 1,
          },
        ],
      }
      return chartData
    }
  }, [filteredData, view])

  // Calcular estatísticas do período
  const stats = useMemo(() => {
    const totalReviews = filteredData.reduce((acc, item) => acc + item.totalReviews, 0)
    const avgRating =
      filteredData.reduce((acc, item) => acc + item.rating * item.totalReviews, 0) /
      totalReviews
    const categories = filteredData.reduce(
      (acc, item) => {
        acc.excellent += item.categories.excellent
        acc.good += item.categories.good
        acc.average += item.categories.average
        acc.poor += item.categories.poor
        return acc
      },
      { excellent: 0, good: 0, average: 0, poor: 0 }
    )

    return {
      totalReviews,
      avgRating: avgRating.toFixed(1),
      categories,
    }
  }, [filteredData])

  return (
    <Card>
      <div className="p-6 space-y-6">
        {/* Header com Filtro */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-text-primary">
              Satisfação dos Pacientes
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {view === 'trend'
                ? 'Evolução da satisfação ao longo do tempo'
                : 'Distribuição das avaliações'}
            </p>
          </div>
          <DateRangeFilter onChange={setDateRange} defaultRange={dateRange} />
        </div>

        {/* Estatísticas do Período */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-surface-variant rounded-lg">
          <div>
            <p className="text-sm text-text-secondary">Avaliação Média</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">
              {stats.avgRating}
              <span className="ml-1 text-sm text-text-tertiary">/ 5.0</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Total de Avaliações</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">
              {stats.totalReviews}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Excelentes</p>
            <p className="mt-1 text-2xl font-semibold text-success">
              {((stats.categories.excellent / stats.totalReviews) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Gráfico */}
        <div style={{ height: 400 }}>
          <Chart
            type={view === 'trend' ? 'line' : 'doughnut'}
            data={chartData}
            options={
              view === 'trend'
                ? {
                    onClick: (event, elements) => {
                      if (elements.length > 0 && onDrillDown) {
                        const index = elements[0].index
                        onDrillDown(filteredData[index].date)
                      }
                    },
                    plugins: {
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      },
                    },
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: 'Avaliação Média',
                        },
                        min: 0,
                        max: 5,
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Total de Avaliações',
                        },
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    },
                  }
                : {
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.parsed
                            return `${context.label}: ${value.toFixed(1)}%`
                          },
                        },
                      },
                    },
                    cutout: '60%',
                  }
            }
          />
        </div>
      </div>
    </Card>
  )
} 