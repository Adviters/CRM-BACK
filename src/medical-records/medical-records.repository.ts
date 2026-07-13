import { Injectable } from '@nestjs/common';
import { MedicalRecord, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export type CreateMedicalRecordData = {
  petId: string;
  veterinarianId: string;
  date?: Date;
  reason: string;
  diagnosis: string;
  treatment: string;
  observations?: string;
  weight?: number;
};

@Injectable()
export class MedicalRecordsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateMedicalRecordData): Promise<MedicalRecord> {
    return this.prisma.medicalRecord.create({ data });
  }

  findById(id: string): Promise<MedicalRecord | null> {
    return this.prisma.medicalRecord.findUnique({ where: { id } });
  }

  async findMany(
    page: number,
    limit: number,
    petId?: string,
  ): Promise<{ items: MedicalRecord[]; total: number }> {
    const where: Prisma.MedicalRecordWhereInput = {
      ...(petId ? { petId } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.medicalRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.medicalRecord.count({ where }),
    ]);

    return { items, total };
  }
}
