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
}
