import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';
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

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAppointmentData): Promise<Appointment> {
    return this.prisma.appointment.create({ data });
  }

  findById(id: string): Promise<Appointment | null> {
    return this.prisma.appointment.findFirst({
      where: { id, deletedAt: null },
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
  ): Promise<{ items: Appointment[]; total: number }> {
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
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { items, total };
  }

  update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  softDelete(id: string): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
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
