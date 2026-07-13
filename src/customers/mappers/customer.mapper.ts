import { Customer } from '@prisma/client';
import { CustomerResponseDto } from '../dto/customer-response.dto';

export class CustomerMapper {
  static toResponse(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      document: customer.document,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
