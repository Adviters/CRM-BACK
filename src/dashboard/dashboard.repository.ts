import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  countCustomers(): Promise<number> {
    return this.prisma.customer.count({ where: { deletedAt: null } });
  }

  countPets(): Promise<number> {
    return this.prisma.pet.count({ where: { deletedAt: null } });
  }

  countMedicalRecords(): Promise<number> {
    return this.prisma.medicalRecord.count();
  }
}
