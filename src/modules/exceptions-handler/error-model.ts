import { ApiProperty } from '@nestjs/swagger';
export abstract class ErrorModel {
  @ApiProperty()
  public error: string;
  @ApiProperty()
  public message: string;
  @ApiProperty()
  public errors: Array<string>;
}
