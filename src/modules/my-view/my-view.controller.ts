import { Body, Controller, Get, Post, Delete, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MyViewService } from './my-view.service';
import { MyView } from './my-view.entity';
import * as moment from 'moment';
import { ErrorModel } from '../exceptions-handler/error-model';
import { DeleteResult } from 'typeorm';

@Controller('my-view')
@ApiTags('MyView')
export class MyViewController {
  constructor(private readonly myViewService: MyViewService) {}

  @Get(':userId')
  @ApiResponse({
    status: 200,
    description: 'Return all saved filter synthesis view by user id',
    type: MyView,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ErrorModel,
  })
  async findAllByUserId(@Param('userId', new ParseIntPipe()) userId: number): Promise<MyView[]> {
    return await this.myViewService.findAllByUserId(userId);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'create a new filter for user',
    type: MyView,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ErrorModel,
  })
  async createOne(@Body() req: MyView): Promise<MyView> {
    req.createdDate = moment().format();
    return await this.myViewService.save(req);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'delete filter id for user',
    type: DeleteResult,
    isArray: false,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: ErrorModel,
  })
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<DeleteResult> {
    return await this.myViewService.delete(id);
  }
}
