import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMedicalRecordDto {
  @ApiProperty()
  @IsUUID()
  petId!: string;

  @ApiPropertyOptional({
    description: 'Required for ADMIN when acting on behalf of a veterinarian',
  })
  @IsOptional()
  @IsUUID()
  veterinarianId?: string;

  @ApiPropertyOptional({ example: '2026-07-13T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: 'Vomiting' })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty({ example: 'Gastritis' })
  @IsString()
  @IsNotEmpty()
  diagnosis!: string;

  @ApiProperty({ example: 'Diet and antiemetics' })
  @IsString()
  @IsNotEmpty()
  treatment!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiPropertyOptional({ example: 12.3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  weight?: number;
}
