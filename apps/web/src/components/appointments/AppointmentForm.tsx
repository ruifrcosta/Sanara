import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

interface AppointmentFormData {
  patientName: string
  date: string
  time: string
  type: { id: number; label: string; value: string }
  notes: string
}

interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormData>
  onSubmit: (data: AppointmentFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

const appointmentTypes = [
  { id: 1, label: 'Consulta Regular', value: 'regular' },
  { id: 2, label: 'Retorno', value: 'followup' },
  { id: 3, label: 'Emergência', value: 'emergency' },
]

export default function AppointmentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({
    patientName: '',
    date: '',
    time: '',
    type: appointmentTypes[0],
    notes: '',
    ...initialData,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData as AppointmentFormData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome do Paciente"
        value={formData.patientName}
        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Data"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <Input
          label="Horário"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>

      <Select
        label="Tipo de Consulta"
        options={appointmentTypes}
        value={formData.type || null}
        onChange={(option) => setFormData({ ...formData, type: option })}
      />

      <Input
        label="Observações"
        as="textarea"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows={3}
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Atualizar' : 'Criar'} Agendamento
        </Button>
      </div>
    </form>
  )
} 