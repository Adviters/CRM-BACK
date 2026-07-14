import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export class AppointmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  date!: Date;

  @ApiProperty({ example: '10:30:00' })
  time!: string;

  @ApiProperty()
  reason!: string;

  @ApiProperty({ enum: AppointmentStatus })
  status!: AppointmentStatus;

  @ApiProperty()
  petId!: string;

  @ApiProperty()
  veterinarianId!: string;

  @ApiProperty({ example: 'Diego Veterinario' })
  veterinarianName!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
