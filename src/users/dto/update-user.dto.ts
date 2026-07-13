import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import {
  PASSWORD_POLICY_MESSAGE,
  PASSWORD_POLICY_PATTERN,
} from './password-policy';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'vet@petshop.local' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'SecurePass123!',
    minLength: 8,
    description: PASSWORD_POLICY_MESSAGE,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_POLICY_PATTERN, { message: PASSWORD_POLICY_MESSAGE })
  password?: string;

  @ApiPropertyOptional({ example: 'Ana' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'García' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
