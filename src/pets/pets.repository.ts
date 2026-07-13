import { Injectable } from '@nestjs/common';
import { Pet, PetSex, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export type CreatePetData = {
  name: string;
  species: string;
  breed?: string;
  sex?: PetSex;
  birthDate?: Date;
  currentWeight?: number;
  color?: string;
  notes?: string;
  customerId: string;
  createdById: string;
};

export type UpdatePetData = Partial<
  Omit<CreatePetData, 'customerId' | 'createdById'>
>;

@Injectable()
export class PetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePetData): Promise<Pet> {
    return this.prisma.pet.create({ data });
  }

  findById(id: string): Promise<Pet | null> {
    return this.prisma.pet.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findMany(
    page: number,
    limit: number,
    customerId?: string,
  ): Promise<{ items: Pet[]; total: number }> {
    const where: Prisma.PetWhereInput = {
      deletedAt: null,
      ...(customerId ? { customerId } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.pet.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.pet.count({ where }),
    ]);

    return { items, total };
  }

  update(id: string, data: UpdatePetData): Promise<Pet> {
    return this.prisma.pet.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string): Promise<Pet> {
    return this.prisma.pet.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
