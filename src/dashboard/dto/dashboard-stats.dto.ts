import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty()
  customersCount!: number;

  @ApiProperty()
  petsCount!: number;

  @ApiProperty()
  appointmentsTodayCount!: number;

  @ApiProperty()
  upcomingVaccinesCount!: number;

  @ApiProperty()
  medicalRecordsCount!: number;
}
