import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AppointmentsService } from './appointments.service';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Create appointment' })
  @ApiCreatedResponse({ type: AppointmentResponseDto })
  create(
    @Body() dto: CreateAppointmentDto,
    @CurrentUser() user: AuthUser,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentsService.create(dto, user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'List appointments' })
  @ApiOkResponse({ type: AppointmentResponseDto, isArray: true })
  findAll(@Query() query: AppointmentQueryDto) {
    return this.appointmentsService.findAll(query.page, query.limit, {
      petId: query.petId,
      veterinarianId: query.veterinarianId,
      status: query.status,
      date: query.date,
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get appointment by id' })
  @ApiOkResponse({ type: AppointmentResponseDto })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Update appointment' })
  @ApiOkResponse({ type: AppointmentResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentsService.update(id, dto);
  }

  @Post(':id/cancel')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiOkResponse({ type: AppointmentResponseDto })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentsService.cancel(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete appointment' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.appointmentsService.remove(id);
  }
}
