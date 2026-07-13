import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VaccineResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  appliedAt!: Date;

  @ApiPropertyOptional()
  nextApplicationAt!: Date | null;

  @ApiProperty()
  petId!: string;

  @ApiProperty()
  veterinarianId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
