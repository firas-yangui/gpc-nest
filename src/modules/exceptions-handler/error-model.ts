import { ApiModelProperty } from '@nestjs/swagger';
export abstract class ErrorModel {
  @ApiModelProperty()
  public error: string;
  @ApiModelProperty()
  public message: string;
  @ApiModelProperty()
  public errors: Array<string>;
}
