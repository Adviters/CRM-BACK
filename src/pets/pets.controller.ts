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
import { CreatePetDto } from './dto/create-pet.dto';
import { PetQueryDto } from './dto/pet-query.dto';
import { PetResponseDto } from './dto/pet-response.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';

@ApiTags('pets')
@ApiBearerAuth()
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Create pet' })
  @ApiCreatedResponse({ type: PetResponseDto })
  create(
    @Body() dto: CreatePetDto,
    @CurrentUser() user: AuthUser,
  ): Promise<PetResponseDto> {
    return this.petsService.create(dto, user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'List pets' })
  @ApiOkResponse({ type: PetResponseDto, isArray: true })
  findAll(@Query() query: PetQueryDto) {
    return this.petsService.findAll(query.page, query.limit, query.customerId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get pet by id' })
  @ApiOkResponse({ type: PetResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PetResponseDto> {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Update basic pet data' })
  @ApiOkResponse({ type: PetResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePetDto,
  ): Promise<PetResponseDto> {
    return this.petsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete pet' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.petsService.remove(id);
  }
}
