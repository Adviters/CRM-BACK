import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResultDto } from '../common/dto/paginated-result.dto';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerMapper } from './mappers/customer.mapper';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async create(
    dto: CreateCustomerDto,
    actorId: string,
  ): Promise<CustomerResponseDto> {
    const existing = await this.customersRepository.findByDocument(
      dto.document,
    );
    if (existing) {
      throw new ConflictException('Document already registered');
    }

    const customer = await this.customersRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      document: dto.document,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      createdById: actorId,
    });

    return CustomerMapper.toResponse(customer);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResultDto<CustomerResponseDto>> {
    const { items, total } = await this.customersRepository.findMany(
      page,
      limit,
      search,
    );

    return new PaginatedResultDto(
      items.map((item) => CustomerMapper.toResponse(item)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<CustomerResponseDto> {
    const customer = await this.getActiveOrThrow(id);
    return CustomerMapper.toResponse(customer);
  }

  async ensureExists(id: string): Promise<void> {
    await this.getActiveOrThrow(id);
  }

  async update(
    id: string,
    dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    await this.getActiveOrThrow(id);

    if (dto.document) {
      const existing = await this.customersRepository.findByDocument(
        dto.document,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException('Document already registered');
      }
    }

    const customer = await this.customersRepository.update(id, dto);
    return CustomerMapper.toResponse(customer);
  }

  async remove(id: string): Promise<void> {
    await this.getActiveOrThrow(id);
    await this.customersRepository.softDelete(id);
  }

  private async getActiveOrThrow(id: string) {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }
}
