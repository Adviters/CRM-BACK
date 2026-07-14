import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { VeterinarianOptionDto } from './dto/veterinarian-option.dto';
import { UserMapper } from './mappers/user.mapper';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.hashPassword(dto.password);
    const user = await this.usersRepository.create({
      email: dto.email.toLowerCase(),
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    });

    return UserMapper.toResponse(user);
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResultDto<UserResponseDto>> {
    const { items, total } = await this.usersRepository.findMany(page, limit);
    return new PaginatedResultDto(
      items.map((item) => UserMapper.toResponse(item)),
      total,
      page,
      limit,
    );
  }

  async findAssignableVeterinarians(): Promise<VeterinarianOptionDto[]> {
    const users = await this.usersRepository.findAssignableVeterinarians();
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as VeterinarianOptionDto['role'],
    }));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.getActiveUserOrThrow(id);
    return UserMapper.toResponse(user);
  }

  async findByEmailForAuth(email: string) {
    return this.usersRepository.findByEmail(email.toLowerCase());
  }

  async findEntityById(id: string) {
    return this.usersRepository.findById(id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.getActiveUserOrThrow(id);

    if (dto.email) {
      const existing = await this.usersRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('Email already registered');
      }
    }

    const passwordHash = dto.password
      ? await this.hashPassword(dto.password)
      : undefined;

    const user = await this.usersRepository.update(id, {
      email: dto.email?.toLowerCase(),
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      isActive: dto.isActive,
    });

    // Credential or privilege changes invalidate every active session.
    const credentialsChanged =
      dto.password !== undefined ||
      dto.role !== undefined ||
      dto.isActive === false;

    if (credentialsChanged) {
      await this.usersRepository.revokeAllRefreshTokens(id);
    }

    return UserMapper.toResponse(user);
  }

  async remove(id: string): Promise<void> {
    await this.getActiveUserOrThrow(id);
    await this.usersRepository.softDelete(id);
    await this.usersRepository.revokeAllRefreshTokens(id);
  }

  private async getActiveUserOrThrow(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds =
      this.configService.getOrThrow<number>('bcrypt.saltRounds');
    return bcrypt.hash(password, saltRounds);
  }
}
