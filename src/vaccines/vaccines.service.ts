import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { Role } from '../common/enums/role.enum';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { VaccineResponseDto } from './dto/vaccine-response.dto';
import { VaccineMapper } from './mappers/vaccine.mapper';
import { VaccinesRepository } from './vaccines.repository';

@Injectable()
export class VaccinesService {
  constructor(
    private readonly vaccinesRepository: VaccinesRepository,
    private readonly petsService: PetsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    dto: CreateVaccineDto,
    actor: AuthUser,
  ): Promise<VaccineResponseDto> {
    await this.petsService.ensureExists(dto.petId);
    const veterinarianId = await this.resolveVeterinarianId(dto, actor);

    const vaccine = await this.vaccinesRepository.create({
      name: dto.name,
      appliedAt: new Date(dto.appliedAt),
      nextApplicationAt: dto.nextApplicationAt
        ? new Date(dto.nextApplicationAt)
        : undefined,
      petId: dto.petId,
      veterinarianId,
    });

    return VaccineMapper.toResponse(vaccine);
  }

  async findAll(
    page: number,
    limit: number,
    petId?: string,
  ): Promise<PaginatedResultDto<VaccineResponseDto>> {
    const { items, total } = await this.vaccinesRepository.findMany(
      page,
      limit,
      petId,
    );

    return new PaginatedResultDto(
      items.map((item) => VaccineMapper.toResponse(item)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<VaccineResponseDto> {
    const vaccine = await this.vaccinesRepository.findById(id);
    if (!vaccine) {
      throw new NotFoundException('Vaccine not found');
    }
    return VaccineMapper.toResponse(vaccine);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.vaccinesRepository.softDelete(id);
  }

  countUpcoming(withinDays = 30): Promise<number> {
    return this.vaccinesRepository.countUpcoming(withinDays);
  }

  private async resolveVeterinarianId(
    dto: CreateVaccineDto,
    actor: AuthUser,
  ): Promise<string> {
    if (actor.role === Role.VETERINARIAN) {
      return actor.id;
    }

    if (actor.role === Role.ADMIN) {
      const veterinarianId = dto.veterinarianId ?? actor.id;
      const user = await this.usersService.findEntityById(veterinarianId);

      if (!user || !user.isActive) {
        throw new BadRequestException('Veterinarian not found');
      }

      if (
        (user.role as Role) !== Role.VETERINARIAN &&
        (user.role as Role) !== Role.ADMIN
      ) {
        throw new BadRequestException('User is not a veterinarian');
      }

      return veterinarianId;
    }

    throw new BadRequestException('Only veterinarians can register vaccines');
  }
}
