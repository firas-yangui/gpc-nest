import { IsString, Length, IsNumber, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HomeMessageDto {
  @ApiProperty()
  @IsString()
  @Length(0, 500)
  public message: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public perimeterId: number;
}
