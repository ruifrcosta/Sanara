import { useState } from 'react'
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'

export interface AuthFormProps {
  type: 'login' | 'register'
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export default function AuthForm({ type, onSubmit, isLoading }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (type === 'register' && !formData.name) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres'
    }

    if (type === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        await onSubmit(formData)
      } catch (error) {
        // Tratar erros da API aqui
        console.error('Erro ao autenticar:', error)
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            {type === 'login' ? 'Entrar' : 'Criar Conta'}
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            {type === 'login'
              ? 'Entre com suas credenciais'
              : 'Preencha os dados para criar sua conta'}
          </p>
        </div>

        {type === 'register' && (
          <Input
            label="Nome"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            fullWidth
            leftIcon={<UserIcon className="h-5 w-5" />}
          />
        )}

        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
          fullWidth
          leftIcon={<EnvelopeIcon className="h-5 w-5" />}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
          fullWidth
          leftIcon={<LockClosedIcon className="h-5 w-5" />}
        />

        {type === 'register' && (
          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="••••••"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={errors.confirmPassword}
            required
            fullWidth
            leftIcon={<LockClosedIcon className="h-5 w-5" />}
          />
        )}

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          {type === 'login' ? 'Entrar' : 'Criar Conta'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-text-secondary">
            {type === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <a
                  href="/register"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Criar conta
                </a>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <a
                  href="/login"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Entrar
                </a>
              </>
            )}
          </p>
        </div>
      </form>
    </Card>
  )
} 