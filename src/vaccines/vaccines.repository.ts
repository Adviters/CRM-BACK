import { Injectable } from '@nestjs/common';
import { Prisma, Vaccine } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export type CreateVaccineData = {
  name: string;
  appliedAt: Date;
  nextApplicationAt?: Date;
  petId: string;
  veterinarianId: string;
};

@Injectable()
export class VaccinesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateVaccineData): Promise<Vaccine> {
    return this.prisma.vaccine.create({ data });
  }

  findById(id: string): Promise<Vaccine | null> {
    return this.prisma.vaccine.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findMany(
    page: number,
    limit: number,
    petId?: string,
  ): Promise<{ items: Vaccine[]; total: number }> {
    const where: Prisma.VaccineWhereInput = {
      deletedAt: null,
      ...(petId ? { petId } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.vaccine.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { appliedAt: 'desc' },
      }),
      this.prisma.vaccine.count({ where }),
    ]);

    return { items, total };
  }

  softDelete(id: string): Promise<Vaccine> {
    return this.prisma.vaccine.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  countUpcoming(withinDays: number): Promise<number> {
    const now = new Date();
    const until = new Date();
    until.setDate(until.getDate() + withinDays);

    return this.prisma.vaccine.count({
      where: {
        deletedAt: null,
        nextApplicationAt: {
          gte: now,
          lte: until,
        },
      },
    });
  }
}
