import { useMemo } from 'react'
import { ChartData } from 'chart.js'
import Chart from './Chart'
import Card from '../ui/Card'

interface DistributionData {
  hour: number
  routine: number
  followUp: number
  emergency: number
}

interface AppointmentDistributionChartProps {
  data: DistributionData[]
  view: 'hour' | 'type'
}

export default function AppointmentDistributionChart({
  data,
  view,
}: AppointmentDistributionChartProps) {
  const chartData = useMemo(() => {
    if (view === 'hour') {
      const chartData: ChartData<'bar'> = {
        labels: data.map((item) => `${item.hour}:00`),
        datasets: [
          {
            label: 'Rotina',
            data: data.map((item) => item.routine),
            backgroundColor: 'rgba(99, 102, 241, 0.8)', // indigo-500
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Retorno',
            data: data.map((item) => item.followUp),
            backgroundColor: 'rgba(34, 197, 94, 0.8)', // green-500
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Emergência',
            data: data.map((item) => item.emergency),
            backgroundColor: 'rgba(239, 68, 68, 0.8)', // red-500
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      }
      return chartData
    } else {
      // Calcular totais por tipo
      const totals = data.reduce(
        (acc, item) => {
          acc.routine += item.routine
          acc.followUp += item.followUp
          acc.emergency += item.emergency
          return acc
        },
        { routine: 0, followUp: 0, emergency: 0 }
      )

      const total = Object.values(totals).reduce((a, b) => a + b, 0)

      const chartData: ChartData<'doughnut'> = {
        labels: ['Rotina', 'Retorno', 'Emergência'],
        datasets: [
          {
            data: [
              (totals.routine / total) * 100,
              (totals.followUp / total) * 100,
              (totals.emergency / total) * 100,
            ],
            backgroundColor: [
              'rgba(99, 102, 241, 0.8)', // indigo-500
              'rgba(34, 197, 94, 0.8)', // green-500
              'rgba(239, 68, 68, 0.8)', // red-500
            ],
            borderColor: [
              'rgb(99, 102, 241)',
              'rgb(34, 197, 94)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 1,
          },
        ],
      }
      return chartData
    }
  }, [data, view])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totals = data.reduce(
      (acc, item) => {
        acc.routine += item.routine
        acc.followUp += item.followUp
        acc.emergency += item.emergency
        return acc
      },
      { routine: 0, followUp: 0, emergency: 0 }
    )

    const total = Object.values(totals).reduce((a, b) => a + b, 0)

    return {
      total,
      routine: totals.routine,
      followUp: totals.followUp,
      emergency: totals.emergency,
      routinePercentage: ((totals.routine / total) * 100).toFixed(1),
      followUpPercentage: ((totals.followUp / total) * 100).toFixed(1),
      emergencyPercentage: ((totals.emergency / total) * 100).toFixed(1),
    }
  }, [data])

  return (
    <Card>
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-text-secondary">Total de Consultas</p>
            <p className="mt-1 text-2xl font-semibold text-text-primary">
              {stats.total}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Rotina</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-primary">
                {stats.routine}
              </p>
              <p className="ml-2 text-sm text-text-tertiary">
                {stats.routinePercentage}%
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Retorno</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-success">
                {stats.followUp}
              </p>
              <p className="ml-2 text-sm text-text-tertiary">
                {stats.followUpPercentage}%
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Emergência</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-error">
                {stats.emergency}
              </p>
              <p className="ml-2 text-sm text-text-tertiary">
                {stats.emergencyPercentage}%
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <Chart
          type={view === 'hour' ? 'bar' : 'doughnut'}
          data={chartData}
          height={300}
          options={
            view === 'hour'
              ? {
                  plugins: {
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    },
                  },
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
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
    </Card>
  )
} 