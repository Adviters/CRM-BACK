import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class VeterinarianOptionDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ enum: Role })
  role!: Role;
}
