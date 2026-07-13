import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export type CreateCustomerData = {
  firstName: string;
  lastName: string;
  document: string;
  phone: string;
  email?: string;
  address?: string;
  createdById: string;
};

export type UpdateCustomerData = Partial<
  Omit<CreateCustomerData, 'createdById'>
>;

@Injectable()
export class CustomersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCustomerData): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  findById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: { id, deletedAt: null },
    });
  }

  findByDocument(document: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: { document, deletedAt: null },
    });
  }

  async findMany(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ items: Customer[]; total: number }> {
    const where: Prisma.CustomerWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { document: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { items, total };
  }

  update(id: string, data: UpdateCustomerData): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
