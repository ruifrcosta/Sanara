import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ChartType,
} from 'chart.js'
import { Chart as ChartComponent } from 'react-chartjs-2'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface ChartProps {
  type: ChartType
  data: ChartData<any>
  options?: ChartOptions<any>
  height?: number
  width?: number
  title?: string
  description?: string
}

export default function Chart({
  type,
  data,
  options = {},
  height,
  width,
  title,
  description,
}: ChartProps) {
  const chartRef = useRef<ChartJS>(null)

  // Configurações padrão do tema
  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x',
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: 'rgb(107, 114, 128)', // text-gray-500
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)', // bg-gray-900 with opacity
        titleColor: 'rgb(243, 244, 246)', // text-gray-100
        bodyColor: 'rgb(243, 244, 246)', // text-gray-100
        padding: 12,
        boxPadding: 8,
        usePointStyle: true,
        bodySpacing: 8,
        titleSpacing: 8,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: type === 'line' || type === 'bar'
      ? {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              padding: 8,
              color: 'rgb(107, 114, 128)', // text-gray-500
            },
          },
          y: {
            grid: {
              color: 'rgba(243, 244, 246, 0.1)', // text-gray-100 with opacity
            },
            ticks: {
              padding: 8,
              color: 'rgb(107, 114, 128)', // text-gray-500
            },
          },
        }
      : undefined,
  }

  // Mesclar opções padrão com opções personalizadas
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins,
    },
  }

  useEffect(() => {
    // Atualizar o gráfico quando os dados mudarem
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [data])

  return (
    <div style={{ height: height || 'auto', width: width || '100%' }}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-medium text-text-primary">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
      )}
      <ChartComponent
        ref={chartRef}
        type={type}
        data={data}
        options={mergedOptions}
        height={height}
        width={width}
      />
    </div>
  )
} 