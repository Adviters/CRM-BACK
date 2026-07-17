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
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Role } from '../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { VeterinarianOptionDto } from './dto/veterinarian-option.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @Get('veterinarians')
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'List assignable veterinarians for appointments' })
  @ApiOkResponse({ type: VeterinarianOptionDto, isArray: true })
  findVeterinarians(): Promise<VeterinarianOptionDto[]> {
    return this.usersService.findAssignableVeterinarians();
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query.page, query.limit);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ type: UserResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ type: UserResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete user' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
