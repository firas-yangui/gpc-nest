import { IsString, Length, IsNumber, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiModelProperty()
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  public lastName: string;

  @ApiModelProperty()
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  public firstName: string;

  @ApiModelProperty()
  @IsEmail()
  @Length(5, 50)
  @IsNotEmpty()
  public email: string;

  @ApiModelProperty()
  @IsNumber()
  @IsNotEmpty()
  public depId: number;
}
