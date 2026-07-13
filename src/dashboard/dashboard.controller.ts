import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@ApiTags('dashboard')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get CRM dashboard indicators' })
  @ApiOkResponse({ type: DashboardStatsDto })
  getStats(): Promise<DashboardStatsDto> {
    return this.dashboardService.getStats();
  }
}
