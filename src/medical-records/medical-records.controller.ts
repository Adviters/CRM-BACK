import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordQueryDto } from './dto/medical-record-query.dto';
import { MedicalRecordResponseDto } from './dto/medical-record-response.dto';
import { MedicalRecordsService } from './medical-records.service';

@ApiTags('medical-records')
@ApiBearerAuth()
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.VETERINARIAN)
  @ApiOperation({
    summary: 'Create medical record (immutable clinical history entry)',
  })
  @ApiCreatedResponse({ type: MedicalRecordResponseDto })
  create(
    @Body() dto: CreateMedicalRecordDto,
    @CurrentUser() user: AuthUser,
  ): Promise<MedicalRecordResponseDto> {
    return this.medicalRecordsService.create(dto, user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VETERINARIAN)
  @ApiOperation({ summary: 'List medical records' })
  @ApiOkResponse({ type: MedicalRecordResponseDto, isArray: true })
  findAll(@Query() query: MedicalRecordQueryDto) {
    return this.medicalRecordsService.findAll(
      query.page,
      query.limit,
      query.petId,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.VETERINARIAN)
  @ApiOperation({ summary: 'Get medical record by id' })
  @ApiOkResponse({ type: MedicalRecordResponseDto })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MedicalRecordResponseDto> {
    return this.medicalRecordsService.findOne(id);
  }
}
