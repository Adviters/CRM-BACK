import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  date!: string;

  @ApiProperty({
    example: '10:30',
    description: 'Local time HH:mm or HH:mm:ss',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
  time!: string;

  @ApiProperty({ example: 'Annual checkup' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason!: string;

  @ApiProperty()
  @IsUUID()
  petId!: string;

  @ApiProperty()
  @IsUUID()
  veterinarianId!: string;
}
