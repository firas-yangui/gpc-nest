import { IsString, Length, IsNumber, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty()
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty()
  @IsEmail()
  @Length(5, 50)
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public depId: number;
}
