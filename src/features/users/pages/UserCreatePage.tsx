import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { UserForm } from '../components/UserForm'
import { useCreateUser } from '../hooks/use-users'
import { ROUTES } from '@/constants/routes'
import type { CreateUserPayload } from '../types/user.types'

export function UserCreatePage() {
  const navigate = useNavigate()
  const createUser = useCreateUser()

  return (
    <div>
      <PageHeader title="Nuevo usuario" description="Alta de personal del sistema." />
      <Card>
        <CardBody>
          <UserForm
            mode="create"
            isSubmitting={createUser.isPending}
            onSubmit={(values) => {
              createUser.mutate(values as CreateUserPayload, {
                onSuccess: () => void navigate(ROUTES.users),
              })
            }}
          />
        </CardBody>
      </Card>
    </div>
  )
}
