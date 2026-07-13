import { Module } from '@nestjs/common';
import { CustomersModule } from '../customers/customers.module';
import { PetsController } from './pets.controller';
import { PetsRepository } from './pets.repository';
import { PetsService } from './pets.service';

@Module({
  imports: [CustomersModule],
  controllers: [PetsController],
  providers: [PetsService, PetsRepository],
  exports: [PetsService],
})
export class PetsModule {}
