import { Get, Query, Header, Controller, Post, Body, Res, HttpStatus, Param, Logger, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ErrorModel } from './../exceptions-handler/error-model';
import { SUCCESS } from '../success-handler/success.constatns';
import { EXCEPTIONS } from '../exceptions-handler/exceptions.constants';
import { NoContent } from '../exceptions-handler/no-content.exception';
import { CustomBadRequestException } from '../exceptions-handler/bad-request.exception';
import { ERRORS } from '../exceptions-handler/errors.constants';
import { Response } from 'express';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { ActivityThirdPartyService } from './activity-thirdparty.service';
import { ActivityThirdParty } from './activity-thirdparty.entity';
import { ActivityThirdPartyDto, ActivityThirdParty as ActivityThirdPartyInterface } from '../activity-thirdparty/activity-thirdparty.dto';
import { ConstantService } from '../constants/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import * as _ from 'lodash';

@Controller('activitythirdparty')
export class ActivityThirdPartyController {
  private logger = new Logger(ActivityThirdPartyController.name);
  constructor(
    private readonly activityThirdPartyService: ActivityThirdPartyService,
    private readonly constantService: ConstantService,
    private readonly thirdpartiesService: ThirdpartiesService,
  ) {}

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
  async addConversionRate(@Body() activityThirdPartyDto: ActivityThirdPartyInterface, @Res() response: Response) {
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

  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'multipart/form-data')
  @Header('Accept-Charset', 'utf-8')
  @ApiOperation({
    description: 'add activity partners with percentage',
    operationId: 'POST /activitythirdparty/upload',
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
  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile('file') file, @Res() response: Response) {
    const fileType = file.originalname.split('.').pop();
    const structureErrors = [];
    const errors = [];
    let headers: string[] = [];
    let rows: string[][] = [];

    //read and convert CSV to array
    if (fileType === 'csv')
      [headers, ...rows] = _.chain(file.buffer.toString('utf-8'))
        .split('\n')
        .compact()
        .map(line => line.split(';'))
        .value();

    //check headers
    for (const header of headers)
      if (!this.constantService.ACTIVITY_THIRPARTY_HEADERS.includes(header)) structureErrors.push(`${header} ${ERRORS.MISSING.TYPE}`);
    if (structureErrors.length != 0) {
      const exception = new CustomBadRequestException(ERRORS.MISSING.CODE, ERRORS.MISSING.DESCRIPTION, structureErrors);
      return exception.toHttpException(response);
    }

    //parse Array
    const data: any[] = _.chain(rows)
      .map(row => _.zipObject(headers, row))
      .groupBy(this.constantService.ACTIVITY_THIRPARTY_HEADERS[0]) //groupBy activity
      .map(activityThirparty => {
        const { activity, startDate, endDate } = activityThirparty[0];
        return {
          activity,
          startDate,
          endDate,
          thirdPartyPercentages: activityThirparty.map(({ thirdpartyTrigram, percentage }) => ({
            thirdpartyTrigram,
            percentage,
          })),
        };
      })
      .value();

    //processData
    for (const { activity, endDate, startDate, thirdPartyPercentages } of data) {
      try {
        //convert thirpartyTrigram to thirdPartyId
        for (const index in thirdPartyPercentages) {
          const { thirdpartyTrigram } = thirdPartyPercentages[index];
          const thirdparty = await this.thirdpartiesService.findOne({ trigram: thirdpartyTrigram });
          if (!thirdparty) throw `Third Party not found with trigram ${thirdpartyTrigram}`;
          thirdPartyPercentages[index].thirdParty = thirdparty.id;
        }

        const activityThirdParty: ActivityThirdPartyInterface = {
          activity: parseInt(activity),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          thirdPartyPercentages: thirdPartyPercentages.map(({ thirdParty, percentage }) => ({
            thirdParty,
            percent: parseInt(percentage),
          })),
        };

        const activityThirdPartyDto: ActivityThirdPartyDto = new ActivityThirdPartyDto(activityThirdParty);

        //functionnal check
        if (!this.activityThirdPartyService.percentageValidation(activityThirdPartyDto.getThirdPartyPercentages()))
          throw ERRORS.PERCENTAGE_KO.DESCRIPTION;
        if (activityThirdPartyDto.getStartDate() > activityThirdPartyDto.getEndDate()) throw ERRORS.DATES_KO.DESCRIPTION;

        //add
        const result = await this.activityThirdPartyService.linkActivityToThirdParty(activityThirdPartyDto);

        switch (result) {
          case ERRORS.ACTIVITY_NOT_FOUND:
            throw ERRORS.ACTIVITY_NOT_FOUND.DESCRIPTION;
          case ERRORS.THIRDPARTY_NOT_FOUND:
            throw ERRORS.THIRDPARTY_NOT_FOUND.DESCRIPTION;
          default:
            break;
        }
      } catch (error) {
        errors.push({
          activity,
          endDate,
          startDate,
          thirdPartyPercentages,
          error,
        });
      }
    }

    return response.status(SUCCESS.CREATE.STATUS).json({ ...SUCCESS.CREATE, rejectedLines: errors });
  }
}
