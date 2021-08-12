import { Get, Query, Header, Controller, Post, Body, Res, HttpStatus, Param, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorModel } from './../exceptions-handler/error-model';
import { SUCCESS } from '../success-handler/success.constatns';
import { EXCEPTIONS } from '../exceptions-handler/exceptions.constants';
import { NoContent } from '../exceptions-handler/no-content.exception';
import { CustomBadRequestException } from '../exceptions-handler/bad-request.exception';
import { ERRORS } from '../exceptions-handler/errors.constants';
import { Response } from 'express';
import { ActivityThirdPartyService } from './activity-thirdparty.service';
import { ActivityThirdParty } from './activity-thirdparty.entity';
import { ActivityThirdPartyDto } from '../activity-thirdparty/activity-thirdparty.dto';
import { ConstantService } from '../constants/constants';

@Controller('activitythirdparty')
export class ActivityThirdPartyController {
  private logger = new Logger(ActivityThirdPartyController.name);
  constructor(private readonly activityThirdPartyService: ActivityThirdPartyService, private readonly constantService: ConstantService) {}

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
    type: ActivityThirdParty,
  })
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: 'activity partners updated',
    isArray: true,
    type: ActivityThirdParty,
  })
  @ApiResponse({
    status: EXCEPTIONS.INTERNAL_SERVER_ERROR.STATUS_CODE,
    description: EXCEPTIONS.INTERNAL_SERVER_ERROR.DESCRIPTION,
    type: ErrorModel,
    isArray: false,
  })
  @ApiResponse({
    status: EXCEPTIONS.BAD_REQUEST.STATUS_CODE,
    description: EXCEPTIONS.BAD_REQUEST.DESCRIPTION,
    type: CustomBadRequestException,
    isArray: false,
  })
  async addConversionRate(@Body() activityThirdPartyDto: ActivityThirdPartyDto, @Res() response: Response) {
    try {
      const structureErrors = [];
      this.constantService.ACTIVIT_THIRDPARTY_KEYS.map(attribute => {
        if (!activityThirdPartyDto[attribute] || activityThirdPartyDto[attribute] == null) {
          structureErrors.push(`${attribute} ${ERRORS.MISSING.TYPE}`);
        }
      });
      if (structureErrors.length != 0) {
        const exception = new CustomBadRequestException(ERRORS.MISSING.CODE, ERRORS.MISSING.DESCRIPTION, structureErrors);
        return exception.toHttpException(response);
      }
      const activityThirdParty = new ActivityThirdPartyDto(activityThirdPartyDto);
      const percentageValide = this.activityThirdPartyService.percentageValidation(activityThirdParty.getThirdPartyPercentages());
      if (!percentageValide) {
        const exception = new CustomBadRequestException(ERRORS.PERCENTAGE_KO.CODE, ERRORS.PERCENTAGE_KO.DESCRIPTION);
        return exception.toHttpException(response);
      }
      if (activityThirdParty.getStartDate() > activityThirdParty.getEndDate()) {
        const exception = new CustomBadRequestException(ERRORS.DATES_KO.CODE, ERRORS.DATES_KO.DESCRIPTION);
        return exception.toHttpException(response);
      }
      const result = await this.activityThirdPartyService.linkActivityToThirdParty(activityThirdParty);
      if (result == ERRORS.ACTIVITY_NOT_FOUND) {
        const exception = new CustomBadRequestException(ERRORS.ACTIVITY_NOT_FOUND.CODE, ERRORS.ACTIVITY_NOT_FOUND.DESCRIPTION);
        return exception.toHttpException(response);
      }
      if (result == ERRORS.THIRDPARTY_NOT_FOUND) {
        const exception = new CustomBadRequestException(ERRORS.THIRDPARTY_NOT_FOUND.CODE, ERRORS.THIRDPARTY_NOT_FOUND.DESCRIPTION);
        return exception.toHttpException(response);
      }
      if (result == SUCCESS.CREATE) {
        return response.status(SUCCESS.CREATE.STATUS).json(SUCCESS.CREATE);
      }
    } catch (error) {
      this.logger.log(error);
    }
  }
}
