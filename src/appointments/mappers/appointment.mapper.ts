import { Appointment } from '@prisma/client';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';

export class AppointmentMapper {
  static toResponse(appointment: Appointment): AppointmentResponseDto {
    return {
      id: appointment.id,
      date: appointment.date,
      time: this.formatTime(appointment.time),
      reason: appointment.reason,
      status: appointment.status as AppointmentStatus,
      petId: appointment.petId,
      veterinarianId: appointment.veterinarianId,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }

  private static formatTime(value: Date): string {
    return value.toISOString().substring(11, 19);
  }
}
