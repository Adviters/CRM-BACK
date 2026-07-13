import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { VaccinesModule } from '../vaccines/vaccines.module';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [AppointmentsModule, VaccinesModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
