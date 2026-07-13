import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

const PLACEHOLDER_SECRET_PATTERN = /change-me/i;

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  NODE_ENV!: string;

  @IsInt()
  @Min(1)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_EXPIRES_IN!: string;

  @IsString()
  @MinLength(32)
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRES_IN!: string;

  @IsInt()
  @Min(10)
  BCRYPT_SALT_ROUNDS!: number;

  @IsBooleanString()
  @IsOptional()
  SWAGGER_ENABLED?: string;

  @IsString()
  @IsOptional()
  SWAGGER_PATH?: string;

  @IsString()
  @IsOptional()
  CORS_ORIGINS?: string;

  @IsEmail()
  @IsOptional()
  ADMIN_EMAIL?: string;

  @IsString()
  @IsOptional()
  ADMIN_PASSWORD?: string;

  @IsString()
  @IsOptional()
  ADMIN_FIRST_NAME?: string;

  @IsString()
  @IsOptional()
  ADMIN_LAST_NAME?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  if (validated.NODE_ENV === 'production') {
    if (
      PLACEHOLDER_SECRET_PATTERN.test(validated.JWT_ACCESS_SECRET) ||
      PLACEHOLDER_SECRET_PATTERN.test(validated.JWT_REFRESH_SECRET)
    ) {
      throw new Error(
        'JWT secrets contain placeholder values. Set real JWT_ACCESS_SECRET and JWT_REFRESH_SECRET before running in production.',
      );
    }

    if (validated.JWT_ACCESS_SECRET === validated.JWT_REFRESH_SECRET) {
      throw new Error(
        'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different in production.',
      );
    }
  }

  return validated;
}
