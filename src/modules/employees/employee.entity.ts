import { ApiProperty } from '@nestjs/swagger';

export class EmployeeEntity {
  id: number;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  depId: number;

  @ApiProperty()
  salary: number;
}
