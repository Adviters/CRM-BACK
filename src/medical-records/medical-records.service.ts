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
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordResponseDto } from './dto/medical-record-response.dto';
import { MedicalRecordMapper } from './mappers/medical-record.mapper';
import { MedicalRecordsRepository } from './medical-records.repository';

@Injectable()
export class MedicalRecordsService {
  constructor(
    private readonly medicalRecordsRepository: MedicalRecordsRepository,
    private readonly petsService: PetsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    dto: CreateMedicalRecordDto,
    actor: AuthUser,
  ): Promise<MedicalRecordResponseDto> {
    await this.petsService.ensureExists(dto.petId);

    const veterinarianId = await this.resolveVeterinarianId(dto, actor);

    const record = await this.medicalRecordsRepository.create({
      petId: dto.petId,
      veterinarianId,
      date: dto.date ? new Date(dto.date) : undefined,
      reason: dto.reason,
      diagnosis: dto.diagnosis,
      treatment: dto.treatment,
      observations: dto.observations,
      weight: dto.weight,
    });

    if (dto.weight !== undefined) {
      await this.petsService.update(dto.petId, { currentWeight: dto.weight });
    }

    return MedicalRecordMapper.toResponse(record);
  }

  async findAll(
    page: number,
    limit: number,
    petId?: string,
  ): Promise<PaginatedResultDto<MedicalRecordResponseDto>> {
    const { items, total } = await this.medicalRecordsRepository.findMany(
      page,
      limit,
      petId,
    );

    return new PaginatedResultDto(
      items.map((item) => MedicalRecordMapper.toResponse(item)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<MedicalRecordResponseDto> {
    const record = await this.medicalRecordsRepository.findById(id);
    if (!record) {
      throw new NotFoundException('Medical record not found');
    }
    return MedicalRecordMapper.toResponse(record);
  }

  private async resolveVeterinarianId(
    dto: CreateMedicalRecordDto,
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

    throw new BadRequestException(
      'Only veterinarians can create medical records',
    );
  }
}
