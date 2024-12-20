import { useMemo } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import Modal from '../ui/Modal'
import { classNames } from '../../utils/classNames'

interface SatisfactionDetails {
  date: string
  rating: number
  totalReviews: number
  categories: {
    excellent: number
    good: number
    average: number
    poor: number
  }
  details?: Array<{
    doctor: string
    specialty: string
    rating: number
    comment?: string
    patientName?: string
    date: string
  }>
}

interface SatisfactionDetailsProps {
  data: SatisfactionDetails
  isOpen: boolean
  onClose: () => void
}

export default function SatisfactionDetails({
  data,
  isOpen,
  onClose,
}: SatisfactionDetailsProps) {
  const formattedDate = useMemo(() => {
    const date = new Date(data.date)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [data.date])

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIcon className="h-5 w-5 text-warning" />
            ) : (
              <StarOutlineIcon className="h-5 w-5 text-warning" />
            )}
          </span>
        ))}
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes das Avaliações"
      description={`Avaliações do dia ${formattedDate}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Resumo do Dia */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-surface-variant rounded-lg">
            <p className="text-sm text-text-secondary">Avaliação Média</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-semibold text-text-primary">{data.rating.toFixed(1)}</p>
              {renderStars(data.rating)}
            </div>
          </div>
          <div className="p-4 bg-surface-variant rounded-lg">
            <p className="text-sm text-text-secondary">Total de Avaliações</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{data.totalReviews}</p>
          </div>
          <div className="p-4 bg-surface-variant rounded-lg">
            <p className="text-sm text-text-secondary">Excelentes</p>
            <p className="mt-2 text-2xl font-semibold text-success">
              {((data.categories.excellent / data.totalReviews) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-surface-variant rounded-lg">
            <p className="text-sm text-text-secondary">Satisfação</p>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {(((data.categories.excellent + data.categories.good) / data.totalReviews) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Lista de Avaliações */}
        {data.details && data.details.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-text-primary">Avaliações Individuais</h4>
            <div className="divide-y divide-border-color">
              {data.details.map((detail, index) => (
                <div key={index} className="py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-text-primary">{detail.doctor}</p>
                      <p className="text-sm text-text-secondary">{detail.specialty}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-text-primary">
                          {detail.rating.toFixed(1)}
                        </span>
                        {renderStars(detail.rating)}
                      </div>
                      <p className="text-sm text-text-tertiary">
                        {new Date(detail.date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  {detail.comment && (
                    <p className="mt-2 text-sm text-text-secondary">{detail.comment}</p>
                  )}
                  {detail.patientName && (
                    <p className="mt-1 text-sm text-text-tertiary">
                      Avaliado por {detail.patientName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            Nenhum detalhe disponível para este dia
          </div>
        )}
      </div>
    </Modal>
  )
} 