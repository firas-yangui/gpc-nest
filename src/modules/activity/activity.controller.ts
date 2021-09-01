import { Get, Query, Header, Controller, Post, Body, Res, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { Activity } from './activity.entity';
import { ErrorModel } from './../exceptions-handler/error-model';
import { SUCCESS } from '../success-handler/success.constatns';
import { EXCEPTIONS } from '../exceptions-handler/exceptions.constants';
import { NoContent } from '../exceptions-handler/no-content.exception';
import { CustomBadRequestException } from '../exceptions-handler/bad-request.exception';
import { ERRORS } from '../exceptions-handler/errors.constants';
import { Response } from 'express';

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get(':activitycode')
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: SUCCESS.OK.DESCRIPTION,
    isArray: true,
    type: Activity,
  })
  @ApiResponse({
    status: SUCCESS.NOCONTENT.STATUS,
    description: SUCCESS.NOCONTENT.DESCRIPTION,
    isArray: false,
    type: Activity,
  })
  async getActivityByCode(@Param('activitycode') activityCode: string, @Res() response: Response): Promise<any> {
    const errors = [];
    const options = {
      where: {
        activityCode,
      },
    };
    const activity = await this.activityService.findOne(options);
    if (activity) {
      return response.status(SUCCESS.OK.STATUS).json(activity);
    } else {
      return response.status(SUCCESS.NOCONTENT.STATUS).json(activity);
    }
  }

  @Post()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  @ApiOperation({
    description: 'add activity partners with percentage',
    operationId: 'POST /activitythirdparty',
  })
  @ApiResponse({
    status: SUCCESS.CREATE.STATUS,
    description: 'activity partners created',
    isArray: true,
    type: Activity,
  })
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: 'activity partners updated',
    isArray: true,
    type: Activity,
  })
  async addActivity(@Body() activityDto: Activity, @Res() response: Response): Promise<any> {
    await this.activityService.save(activityDto);
  }

  @Get('get-activity/:projectCode')
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: SUCCESS.OK.DESCRIPTION,
    isArray: true,
    type: Activity,
  })
  @ApiResponse({
    status: SUCCESS.NOCONTENT.STATUS,
    description: SUCCESS.NOCONTENT.DESCRIPTION,
    isArray: false,
    type: Activity,
  })
  async getActivityByProjectCode(@Param('projectCode') projectCode: string, @Res() response: Response): Promise<any> {
    const options = {
      where: {
        projectCode,
      },
    };
    const activity = await this.activityService.find(options);
    if (activity) {
      return response.status(SUCCESS.OK.STATUS).json(activity);
    } else {
      return response.status(SUCCESS.NOCONTENT.STATUS).json(activity);
    }
  }
}
