import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { AppointmentStatus } from '../common/enums/appointment-status.enum';
import { Role } from '../common/enums/role.enum';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentMapper } from './mappers/appointment.mapper';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly petsService: PetsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    dto: CreateAppointmentDto,
    actorId: string,
  ): Promise<AppointmentResponseDto> {
    await this.petsService.ensureExists(dto.petId);
    await this.ensureVeterinarian(dto.veterinarianId);

    const date = this.toDateOnly(dto.date);
    const time = this.toTime(dto.time);
    await this.ensureSlotAvailable(dto.veterinarianId, date, time);

    const appointment = await this.appointmentsRepository.create({
      date,
      time,
      reason: dto.reason,
      petId: dto.petId,
      veterinarianId: dto.veterinarianId,
      createdById: actorId,
    });

    return AppointmentMapper.toResponse(appointment);
  }

  async findAll(
    page: number,
    limit: number,
    filters: {
      petId?: string;
      veterinarianId?: string;
      status?: AppointmentStatus;
      date?: string;
    },
  ): Promise<PaginatedResultDto<AppointmentResponseDto>> {
    const { items, total } = await this.appointmentsRepository.findMany(
      page,
      limit,
      {
        petId: filters.petId,
        veterinarianId: filters.veterinarianId,
        status: filters.status,
        date: filters.date ? this.toDateOnly(filters.date) : undefined,
      },
    );

    return new PaginatedResultDto(
      items.map((item) => AppointmentMapper.toResponse(item)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.getActiveOrThrow(id);
    return AppointmentMapper.toResponse(appointment);
  }

  async update(
    id: string,
    dto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const current = await this.getActiveOrThrow(id);

    if (dto.petId) {
      await this.petsService.ensureExists(dto.petId);
    }

    if (dto.veterinarianId) {
      await this.ensureVeterinarian(dto.veterinarianId);
    }

    const slotChanged =
      dto.date !== undefined ||
      dto.time !== undefined ||
      dto.veterinarianId !== undefined;

    if (slotChanged) {
      const veterinarianId = dto.veterinarianId ?? current.veterinarianId;
      const date = dto.date ? this.toDateOnly(dto.date) : current.date;
      const time = dto.time ? this.toTime(dto.time) : current.time;
      await this.ensureSlotAvailable(veterinarianId, date, time, id);
    }

    const appointment = await this.appointmentsRepository.update(id, {
      date: dto.date ? this.toDateOnly(dto.date) : undefined,
      time: dto.time ? this.toTime(dto.time) : undefined,
      reason: dto.reason,
      petId: dto.petId,
      veterinarianId: dto.veterinarianId,
      status: dto.status,
    });

    return AppointmentMapper.toResponse(appointment);
  }

  async cancel(id: string): Promise<AppointmentResponseDto> {
    const current = await this.getActiveOrThrow(id);
    const status = current.status as AppointmentStatus;

    if (status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment already cancelled');
    }

    if (status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException(
        'Completed appointments cannot be cancelled',
      );
    }

    const appointment = await this.appointmentsRepository.update(id, {
      status: AppointmentStatus.CANCELLED,
    });

    return AppointmentMapper.toResponse(appointment);
  }

  async remove(id: string): Promise<void> {
    await this.getActiveOrThrow(id);
    await this.appointmentsRepository.softDelete(id);
  }

  countByDate(date: Date): Promise<number> {
    return this.appointmentsRepository.countByDate(date);
  }

  private async getActiveOrThrow(id: string) {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  private async ensureSlotAvailable(
    veterinarianId: string,
    date: Date,
    time: Date,
    excludeId?: string,
  ): Promise<void> {
    const conflicting = await this.appointmentsRepository.findConflicting(
      veterinarianId,
      date,
      time,
      excludeId,
    );

    if (conflicting) {
      throw new ConflictException(
        'The veterinarian already has an appointment at that date and time',
      );
    }
  }

  private async ensureVeterinarian(userId: string): Promise<void> {
    const user = await this.usersService.findEntityById(userId);

    if (!user || !user.isActive) {
      throw new BadRequestException('Veterinarian not found');
    }

    const role = user.role as Role;
    if (role !== Role.VETERINARIAN && role !== Role.ADMIN) {
      throw new BadRequestException('Assigned user is not a veterinarian');
    }
  }

  private toDateOnly(value: string): Date {
    return new Date(`${value.substring(0, 10)}T00:00:00.000Z`);
  }

  private toTime(value: string): Date {
    const normalized = value.length === 5 ? `${value}:00` : value;
    return new Date(`1970-01-01T${normalized}.000Z`);
  }
}
