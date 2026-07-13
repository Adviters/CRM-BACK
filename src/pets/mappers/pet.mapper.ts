import { Pet } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PetSex } from '../../common/enums/pet-sex.enum';
import { PetResponseDto } from '../dto/pet-response.dto';

export class PetMapper {
  static toResponse(pet: Pet): PetResponseDto {
    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      sex: pet.sex as PetSex,
      birthDate: pet.birthDate,
      currentWeight: this.toNumber(pet.currentWeight),
      color: pet.color,
      notes: pet.notes,
      customerId: pet.customerId,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    };
  }

  private static toNumber(value: Decimal | null): number | null {
    return value === null ? null : Number(value);
  }
}
