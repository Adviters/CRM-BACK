import { MedicalRecord } from '@prisma/client';
import { MedicalRecordResponseDto } from '../dto/medical-record-response.dto';

export class MedicalRecordMapper {
  static toResponse(record: MedicalRecord): MedicalRecordResponseDto {
    return {
      id: record.id,
      date: record.date,
      reason: record.reason,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      observations: record.observations,
      weight: record.weight === null ? null : Number(record.weight),
      petId: record.petId,
      veterinarianId: record.veterinarianId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
