import { IsString, Length, IsNumber, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class HomeMessageDto {
  @ApiModelProperty()
  @IsString()
  @Length(0, 500)
  public message: string;

  @ApiModelProperty()
  @IsNumber()
  @IsNotEmpty()
  public perimeterId: number;
}
