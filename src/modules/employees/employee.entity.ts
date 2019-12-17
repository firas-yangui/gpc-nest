import { ApiModelProperty } from '@nestjs/swagger';

export class EmployeeEntity {
  id: number;

  @ApiModelProperty()
  lastName: string;

  @ApiModelProperty()
  firstName: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  isActive: boolean;

  @ApiModelProperty()
  depId: number;

  @ApiModelProperty()
  salary: number;
}
