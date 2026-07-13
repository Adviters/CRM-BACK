import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PetSex } from '../../common/enums/pet-sex.enum';

export class PetResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  species!: string;

  @ApiPropertyOptional()
  breed!: string | null;

  @ApiProperty({ enum: PetSex })
  sex!: PetSex;

  @ApiPropertyOptional()
  birthDate!: Date | null;

  @ApiPropertyOptional()
  currentWeight!: number | null;

  @ApiPropertyOptional()
  color!: string | null;

  @ApiPropertyOptional()
  notes!: string | null;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
