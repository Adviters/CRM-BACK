import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MedicalRecordResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  date!: Date;

  @ApiProperty()
  reason!: string;

  @ApiProperty()
  diagnosis!: string;

  @ApiProperty()
  treatment!: string;

  @ApiPropertyOptional()
  observations!: string | null;

  @ApiPropertyOptional()
  weight!: number | null;

  @ApiProperty()
  petId!: string;

  @ApiProperty()
  veterinarianId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
