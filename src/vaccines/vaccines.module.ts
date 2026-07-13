import { Module } from '@nestjs/common';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';
import { VaccinesController } from './vaccines.controller';
import { VaccinesRepository } from './vaccines.repository';
import { VaccinesService } from './vaccines.service';

@Module({
  imports: [PetsModule, UsersModule],
  controllers: [VaccinesController],
  providers: [VaccinesService, VaccinesRepository],
  exports: [VaccinesService],
})
export class VaccinesModule {}
