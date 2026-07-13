import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { CustomerForm } from '../components/CustomerForm'
import { useCreateCustomer } from '../hooks/use-customers'
import { ROUTES } from '@/constants/routes'

export function CustomerCreatePage() {
  const navigate = useNavigate()
  const createCustomer = useCreateCustomer()

  return (
    <div>
      <PageHeader title="Nuevo cliente" description="Registrá un nuevo tutor." />
      <Card>
        <CardBody>
          <CustomerForm
            isSubmitting={createCustomer.isPending}
            submitLabel="Crear cliente"
            onSubmit={(values) => {
              createCustomer.mutate(values, {
                onSuccess: (customer) => {
                  void navigate(ROUTES.customerDetail(customer.id))
                },
              })
            }}
          />
        </CardBody>
      </Card>
    </div>
  )
}
