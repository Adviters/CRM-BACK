import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Loader } from '@/components/feedback/Loader'
import { CustomerForm } from '../components/CustomerForm'
import { useCustomer, useUpdateCustomer } from '../hooks/use-customers'
import { ROUTES } from '@/constants/routes'

export function CustomerEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useCustomer(id)
  const updateCustomer = useUpdateCustomer(id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" label="Cargando cliente..." />
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader
        title="Editar cliente"
        description={`${data.firstName} ${data.lastName}`}
      />
      <Card>
        <CardBody>
          <CustomerForm
            initialValues={data}
            isSubmitting={updateCustomer.isPending}
            submitLabel="Guardar cambios"
            onSubmit={(values) => {
              updateCustomer.mutate(values, {
                onSuccess: () => {
                  void navigate(ROUTES.customerDetail(id))
                },
              })
            }}
          />
        </CardBody>
      </Card>
    </div>
  )
}
