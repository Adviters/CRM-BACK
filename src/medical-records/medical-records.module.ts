import { Module } from '@nestjs/common';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsRepository } from './medical-records.repository';
import { MedicalRecordsService } from './medical-records.service';

@Module({
  imports: [PetsModule, UsersModule],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService, MedicalRecordsRepository],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
