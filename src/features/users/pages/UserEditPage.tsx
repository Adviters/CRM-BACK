import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Loader } from '@/components/feedback/Loader'
import { UserForm } from '../components/UserForm'
import { useUpdateUser, useUser } from '../hooks/use-users'
import { ROUTES } from '@/constants/routes'
import type { UpdateUserPayload } from '../types/user.types'

export function UserEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useUser(id)
  const updateUser = useUpdateUser(id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" label="Cargando usuario..." />
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader
        title="Editar usuario"
        description={`${data.firstName} ${data.lastName}`}
      />
      <Card>
        <CardBody>
          <UserForm
            mode="edit"
            initialValues={data}
            isSubmitting={updateUser.isPending}
            onSubmit={(values) => {
              updateUser.mutate(values as UpdateUserPayload, {
                onSuccess: () => void navigate(ROUTES.users),
              })
            }}
          />
        </CardBody>
      </Card>
    </div>
  )
}
