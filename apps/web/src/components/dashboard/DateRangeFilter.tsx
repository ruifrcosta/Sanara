import { useState } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'

interface DateRange {
  startDate: string
  endDate: string
}

interface DateRangeFilterProps {
  onChange: (range: DateRange) => void
  defaultRange?: DateRange
}

const presetRanges = [
  { label: 'Últimos 7 dias', days: 7 },
  { label: 'Últimos 30 dias', days: 30 },
  { label: 'Últimos 90 dias', days: 90 },
]

export default function DateRangeFilter({
  onChange,
  defaultRange,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [range, setRange] = useState<DateRange>(
    defaultRange || {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    }
  )

  const handlePresetClick = (days: number) => {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
    const newRange = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }
    setRange(newRange)
  }

  const handleApply = () => {
    onChange(range)
    setIsOpen(false)
  }

  const formatDateRange = (range: DateRange) => {
    const start = new Date(range.startDate)
    const end = new Date(range.endDate)
    return `${start.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center"
      >
        <CalendarIcon className="h-4 w-4 mr-2" />
        {formatDateRange(range)}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Selecionar Período"
        description="Escolha um período predefinido ou defina um intervalo personalizado"
      >
        <div className="space-y-6">
          {/* Presets */}
          <div className="flex gap-2">
            {presetRanges.map((preset) => (
              <Button
                key={preset.days}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(preset.days)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Custom Range */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Data Inicial"
              value={range.startDate}
              onChange={(e) => setRange({ ...range, startDate: e.target.value })}
              max={range.endDate}
            />
            <Input
              type="date"
              label="Data Final"
              value={range.endDate}
              onChange={(e) => setRange({ ...range, endDate: e.target.value })}
              min={range.startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApply}>Aplicar</Button>
          </div>
        </div>
      </Modal>
    </>
  )
} 