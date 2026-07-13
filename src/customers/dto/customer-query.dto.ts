import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class CustomerQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search by name, document or email' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
