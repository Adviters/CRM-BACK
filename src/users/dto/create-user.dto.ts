import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import {
  PASSWORD_POLICY_MESSAGE,
  PASSWORD_POLICY_PATTERN,
} from './password-policy';

export class CreateUserDto {
  @ApiProperty({ example: 'vet@petshop.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'SecurePass123!',
    minLength: 8,
    description: PASSWORD_POLICY_MESSAGE,
  })
  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_POLICY_PATTERN, { message: PASSWORD_POLICY_MESSAGE })
  password!: string;

  @ApiProperty({ example: 'Ana' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'García' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ enum: Role, example: Role.VETERINARIAN })
  @IsEnum(Role)
  role!: Role;
}
