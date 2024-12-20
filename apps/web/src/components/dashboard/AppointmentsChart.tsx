import { useMemo } from 'react'
import { ChartData } from 'chart.js'
import Chart from './Chart'
import Card from '../ui/Card'

interface AppointmentData {
  date: string
  total: number
  completed: number
  cancelled: number
}

interface AppointmentsChartProps {
  data: AppointmentData[]
  period: 'day' | 'week' | 'month'
}

export default function AppointmentsChart({ data, period }: AppointmentsChartProps) {
  const chartData = useMemo(() => {
    const chartData: ChartData<'line'> = {
      labels: data.map((item) => {
        const date = new Date(item.date)
        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: period === 'month' ? 'short' : undefined,
        })
      }),
      datasets: [
        {
          label: 'Total de Consultas',
          data: data.map((item) => item.total),
          borderColor: 'rgb(99, 102, 241)', // indigo-500
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Realizadas',
          data: data.map((item) => item.completed),
          borderColor: 'rgb(34, 197, 94)', // green-500
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Canceladas',
          data: data.map((item) => item.cancelled),
          borderColor: 'rgb(239, 68, 68)', // red-500
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    }
    return chartData
  }, [data, period])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalAppointments = data.reduce((acc, item) => acc + item.total, 0)
    const completedAppointments = data.reduce((acc, item) => acc + item.completed, 0)
    const cancelledAppointments = data.reduce((acc, item) => acc + item.cancelled, 0)
    const completionRate = (completedAppointments / totalAppointments) * 100

    return {
      total: totalAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      completionRate: completionRate.toFixed(1),
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
            <p className="text-sm text-text-secondary">Realizadas</p>
            <p className="mt-1 text-2xl font-semibold text-success">
              {stats.completed}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Canceladas</p>
            <p className="mt-1 text-2xl font-semibold text-error">
              {stats.cancelled}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Taxa de Realização</p>
            <p className="mt-1 text-2xl font-semibold text-primary">
              {stats.completionRate}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <Chart
          type="line"
          data={chartData}
          height={300}
          options={{
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
        />
      </div>
    </Card>
  )
} 