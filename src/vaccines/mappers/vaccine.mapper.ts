import { Vaccine } from '@prisma/client';
import { VaccineResponseDto } from '../dto/vaccine-response.dto';

export class VaccineMapper {
  static toResponse(vaccine: Vaccine): VaccineResponseDto {
    return {
      id: vaccine.id,
      name: vaccine.name,
      appliedAt: vaccine.appliedAt,
      nextApplicationAt: vaccine.nextApplicationAt,
      petId: vaccine.petId,
      veterinarianId: vaccine.veterinarianId,
      createdAt: vaccine.createdAt,
      updatedAt: vaccine.updatedAt,
    };
  }
}
