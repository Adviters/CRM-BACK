import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { CustomersService } from '../customers/customers.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetResponseDto } from './dto/pet-response.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetMapper } from './mappers/pet.mapper';
import { PetsRepository } from './pets.repository';

@Injectable()
export class PetsService {
  constructor(
    private readonly petsRepository: PetsRepository,
    private readonly customersService: CustomersService,
  ) {}

  async create(dto: CreatePetDto, actorId: string): Promise<PetResponseDto> {
    await this.customersService.ensureExists(dto.customerId);

    const pet = await this.petsRepository.create({
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      sex: dto.sex,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      currentWeight: dto.currentWeight,
      color: dto.color,
      notes: dto.notes,
      customerId: dto.customerId,
      createdById: actorId,
    });

    return PetMapper.toResponse(pet);
  }

  async findAll(
    page: number,
    limit: number,
    customerId?: string,
  ): Promise<PaginatedResultDto<PetResponseDto>> {
    const { items, total } = await this.petsRepository.findMany(
      page,
      limit,
      customerId,
    );

    return new PaginatedResultDto(
      items.map((item) => PetMapper.toResponse(item)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<PetResponseDto> {
    const pet = await this.getActiveOrThrow(id);
    return PetMapper.toResponse(pet);
  }

  async ensureExists(id: string): Promise<void> {
    await this.getActiveOrThrow(id);
  }

  async update(id: string, dto: UpdatePetDto): Promise<PetResponseDto> {
    await this.getActiveOrThrow(id);

    const pet = await this.petsRepository.update(id, {
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      sex: dto.sex,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      currentWeight: dto.currentWeight,
      color: dto.color,
      notes: dto.notes,
    });

    return PetMapper.toResponse(pet);
  }

  async remove(id: string): Promise<void> {
    await this.getActiveOrThrow(id);
    await this.petsRepository.softDelete(id);
  }

  private async getActiveOrThrow(id: string) {
    const pet = await this.petsRepository.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    return pet;
  }
}
