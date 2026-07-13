import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { VaccineQueryDto } from './dto/vaccine-query.dto';
import { VaccineResponseDto } from './dto/vaccine-response.dto';
import { VaccinesService } from './vaccines.service';

@ApiTags('vaccines')
@ApiBearerAuth()
@Controller('vaccines')
export class VaccinesController {
  constructor(private readonly vaccinesService: VaccinesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.VETERINARIAN)
  @ApiOperation({ summary: 'Register vaccine application' })
  @ApiCreatedResponse({ type: VaccineResponseDto })
  create(
    @Body() dto: CreateVaccineDto,
    @CurrentUser() user: AuthUser,
  ): Promise<VaccineResponseDto> {
    return this.vaccinesService.create(dto, user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'List vaccines' })
  @ApiOkResponse({ type: VaccineResponseDto, isArray: true })
  findAll(@Query() query: VaccineQueryDto) {
    return this.vaccinesService.findAll(query.page, query.limit, query.petId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get vaccine by id' })
  @ApiOkResponse({ type: VaccineResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<VaccineResponseDto> {
    return this.vaccinesService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete vaccine' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.vaccinesService.remove(id);
  }
}
