import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Checkbox } from '@/components/ui/Checkbox'
import { FormField } from '@/components/forms/FormField'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'
import { useLogin } from '../hooks/use-login'

export function LoginForm() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        login.mutate(values)
      })}
      noValidate
    >
      <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          hasError={Boolean(errors.email)}
          placeholder="admin@petshop.local"
          {...register('email')}
        />
      </FormField>

      <FormField label="Contraseña" htmlFor="password" error={errors.password?.message} required>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          hasError={Boolean(errors.password)}
          placeholder="••••••••"
          {...register('password')}
        />
      </FormField>

      <Checkbox label="Recordarme" {...register('rememberMe')} />

      <Button type="submit" className="w-full" isLoading={login.isPending}>
        Iniciar sesión
      </Button>
    </form>
  )
}
