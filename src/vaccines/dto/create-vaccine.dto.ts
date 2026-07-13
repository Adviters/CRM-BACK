import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateVaccineDto {
  @ApiProperty({ example: 'Rabies' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: '2026-07-13T10:00:00.000Z' })
  @IsDateString()
  appliedAt!: string;

  @ApiPropertyOptional({ example: '2027-07-13T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  nextApplicationAt?: string;

  @ApiProperty()
  @IsUUID()
  petId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  veterinarianId?: string;
}
