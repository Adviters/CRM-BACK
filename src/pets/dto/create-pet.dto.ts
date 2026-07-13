import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { PetSex } from '../../common/enums/pet-sex.enum';

export class CreatePetDto {
  @ApiProperty({ example: 'Luna' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Dog' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  species!: string;

  @ApiPropertyOptional({ example: 'Labrador' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string;

  @ApiPropertyOptional({ enum: PetSex, default: PetSex.UNKNOWN })
  @IsOptional()
  @IsEnum(PetSex)
  sex?: PetSex;

  @ApiPropertyOptional({ example: '2020-05-12' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 12.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentWeight?: number;

  @ApiPropertyOptional({ example: 'Black' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty()
  @IsUUID()
  customerId!: string;
}
