import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentStatus, Prisma, User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export type CreateAppointmentData = {
  date: Date;
  time: Date;
  reason: string;
  petId: string;
  veterinarianId: string;
  createdById: string;
  status?: AppointmentStatus;
};

export type UpdateAppointmentData = Partial<
  Omit<CreateAppointmentData, 'createdById'>
> & {
  status?: AppointmentStatus;
};

export type AppointmentWithVeterinarian = Appointment & {
  veterinarian: Pick<User, 'id' | 'firstName' | 'lastName'>;
};

const veterinarianSelect = {
  id: true,
  firstName: true,
  lastName: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAppointmentData): Promise<AppointmentWithVeterinarian> {
    return this.prisma.appointment.create({
      data,
      include: { veterinarian: { select: veterinarianSelect } },
    });
  }

  findById(id: string): Promise<AppointmentWithVeterinarian | null> {
    return this.prisma.appointment.findFirst({
      where: { id, deletedAt: null },
      include: { veterinarian: { select: veterinarianSelect } },
    });
  }

  async findMany(
    page: number,
    limit: number,
    filters: {
      petId?: string;
      veterinarianId?: string;
      status?: AppointmentStatus;
      date?: Date;
    },
  ): Promise<{ items: AppointmentWithVeterinarian[]; total: number }> {
    const where: Prisma.AppointmentWhereInput = {
      deletedAt: null,
      ...(filters.petId ? { petId: filters.petId } : {}),
      ...(filters.veterinarianId
        ? { veterinarianId: filters.veterinarianId }
        : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.date ? { date: filters.date } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
        include: { veterinarian: { select: veterinarianSelect } },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { items, total };
  }

  update(
    id: string,
    data: UpdateAppointmentData,
  ): Promise<AppointmentWithVeterinarian> {
    return this.prisma.appointment.update({
      where: { id },
      data,
      include: { veterinarian: { select: veterinarianSelect } },
    });
  }

  softDelete(id: string): Promise<AppointmentWithVeterinarian> {
    return this.prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: { veterinarian: { select: veterinarianSelect } },
    });
  }

  findConflicting(
    veterinarianId: string,
    date: Date,
    time: Date,
    excludeId?: string,
  ): Promise<Appointment | null> {
    return this.prisma.appointment.findFirst({
      where: {
        veterinarianId,
        date,
        time,
        deletedAt: null,
        status: { not: AppointmentStatus.CANCELLED },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  }

  countByDate(date: Date): Promise<number> {
    return this.prisma.appointment.count({
      where: {
        deletedAt: null,
        date,
        status: { not: AppointmentStatus.CANCELLED },
      },
    });
  }
}
