import { Injectable } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { VaccinesService } from '../vaccines/vaccines.service';
import { DashboardRepository } from './dashboard.repository';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly appointmentsService: AppointmentsService,
    private readonly vaccinesService: VaccinesService,
  ) {}

  async getStats(): Promise<DashboardStatsDto> {
    const today = new Date();
    const dateOnly = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );

    const [
      customersCount,
      petsCount,
      appointmentsTodayCount,
      upcomingVaccinesCount,
      medicalRecordsCount,
    ] = await Promise.all([
      this.dashboardRepository.countCustomers(),
      this.dashboardRepository.countPets(),
      this.appointmentsService.countByDate(dateOnly),
      this.vaccinesService.countUpcoming(30),
      this.dashboardRepository.countMedicalRecords(),
    ]);

    return {
      customersCount,
      petsCount,
      appointmentsTodayCount,
      upcomingVaccinesCount,
      medicalRecordsCount,
    };
  }
}
