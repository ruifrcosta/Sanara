import { useState } from 'react'

interface Appointment {
  id: number
  name: string
  imageUrl: string
  startDatetime: string
  endDatetime: string
  type: string
}

interface AppointmentFormData {
  patientName: string
  date: string
  time: string
  type: { id: number; label: string; value: string }
  notes: string
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      name: 'Maria Silva',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      startDatetime: '2023-12-19T13:00',
      endDatetime: '2023-12-19T14:30',
      type: 'Consulta Regular',
    },
    {
      id: 2,
      name: 'João Santos',
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      startDatetime: '2023-12-19T15:00',
      endDatetime: '2023-12-19T16:30',
      type: 'Retorno',
    },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAppointment = async (data: AppointmentFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // TODO: Implement API call
      const endTime = new Date(`${data.date}T${data.time}`)
      endTime.setHours(endTime.getHours() + 1)

      const newAppointment: Appointment = {
        id: appointments.length + 1,
        name: data.patientName,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        startDatetime: `${data.date}T${data.time}`,
        endDatetime: endTime.toISOString(),
        type: data.type.label,
      }

      setAppointments([...appointments, newAppointment])
      return newAppointment
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateAppointment = async (id: number, data: AppointmentFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // TODO: Implement API call
      const endTime = new Date(`${data.date}T${data.time}`)
      endTime.setHours(endTime.getHours() + 1)

      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              name: data.patientName,
              startDatetime: `${data.date}T${data.time}`,
              endDatetime: endTime.toISOString(),
              type: data.type.label,
            }
          : appointment
      )

      setAppointments(updatedAppointments)
      return updatedAppointments.find((a) => a.id === id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar agendamento')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAppointment = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)

      // TODO: Implement API call
      const updatedAppointments = appointments.filter((appointment) => appointment.id !== id)
      setAppointments(updatedAppointments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir agendamento')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(
      (appointment) => appointment.startDatetime.split('T')[0] === date
    )
  }

  return {
    appointments,
    isLoading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
  }
} 