import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { PetForm } from '../components/PetForm'
import { useCreatePet } from '../hooks/use-pets'
import { ROUTES } from '@/constants/routes'

export function PetCreatePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const defaultCustomerId = params.get('customerId') ?? undefined
  const createPet = useCreatePet()

  return (
    <div>
      <PageHeader title="Nueva mascota" description="Registrá un nuevo paciente." />
      <Card>
        <CardBody>
          <PetForm
            defaultCustomerId={defaultCustomerId}
            lockCustomer={Boolean(defaultCustomerId)}
            isSubmitting={createPet.isPending}
            submitLabel="Crear mascota"
            onSubmit={(values) => {
              createPet.mutate(values, {
                onSuccess: (pet) => {
                  void navigate(ROUTES.petDetail(pet.id))
                },
              })
            }}
          />
        </CardBody>
      </Card>
    </div>
  )
}
