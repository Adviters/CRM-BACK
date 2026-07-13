import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Loader } from '@/components/feedback/Loader'
import { PetForm } from '../components/PetForm'
import { usePet, useUpdatePet } from '../hooks/use-pets'
import { ROUTES } from '@/constants/routes'

export function PetEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = usePet(id)
  const updatePet = useUpdatePet(id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="lg" label="Cargando mascota..." />
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => void refetch()} />
  }

  return (
    <div>
      <PageHeader title="Editar mascota" description={data.name} />
      <Card>
        <CardBody>
          <PetForm
            initialValues={data}
            isSubmitting={updatePet.isPending}
            submitLabel="Guardar cambios"
            onSubmit={(values) => {
              updatePet.mutate(
                {
                  name: values.name,
                  species: values.species,
                  breed: values.breed,
                  sex: values.sex,
                  birthDate: values.birthDate,
                  currentWeight: values.currentWeight,
                  color: values.color,
                  notes: values.notes,
                },
                {
                  onSuccess: () => {
                    void navigate(ROUTES.petDetail(id))
                  },
                },
              )
            }}
          />
        </CardBody>
      </Card>
    </div>
  )
}
