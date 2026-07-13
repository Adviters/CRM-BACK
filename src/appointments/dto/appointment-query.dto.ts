import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

export class AppointmentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  petId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  veterinarianId?: string;

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({ example: '2026-07-13' })
  @IsOptional()
  @IsDateString()
  date?: string;
}
