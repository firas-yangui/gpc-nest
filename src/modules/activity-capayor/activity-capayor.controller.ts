import { Get, Query, Header, Controller, Post, Body, Res, HttpStatus, Param, Logger, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ErrorModel } from '../exceptions-handler/error-model';
import { SUCCESS } from '../success-handler/success.constatns';
import { EXCEPTIONS } from '../exceptions-handler/exceptions.constants';
import { NoContent } from '../exceptions-handler/no-content.exception';
import { CustomBadRequestException } from '../exceptions-handler/bad-request.exception';
import { ERRORS } from '../exceptions-handler/errors.constants';
import { Response } from 'express';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { ActivityCapayorService } from './activity-capayorservice';
import { ActivityCapayorDto, ActivityCapayorInterface } from './activity-capayor.dto';
import { ActivityCapayor } from './activity-capayor.entity';
import { ConstantService } from '../constants/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import * as _ from 'lodash';
import { ActivityService } from '../activity/activity.service';

@ApiTags('capayorparty')
@Controller('activitycapayor')
export class ActivityCapayorController {
  private logger = new Logger(ActivityCapayorController.name);
  constructor(
    private readonly activityCapayorService: ActivityCapayorService,
    private readonly constantService: ConstantService,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly activityService: ActivityService,
  ) {}

  @Post()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  @ApiOperation({
    description: 'add activity partners with percentage',
    operationId: 'POST /capayorparty',
  })
  @ApiResponse({
    status: SUCCESS.CREATE.STATUS,
    description: 'activity partners created',
    isArray: true,
    type: ActivityCapayor,
  })
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: 'activity partners updated',
    isArray: true,
    type: ActivityCapayor,
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
  async addCapayor(@Body() activityCapayorDto: ActivityCapayorInterface, @Res() response: Response) {
    try {
      const structureErrors = [];
      this.constantService.ACTIVIT_CAPAYOR_KEYS.map(attribute => {
        if (!activityCapayorDto[attribute] || activityCapayorDto[attribute] == null) {
          structureErrors.push(`${attribute} ${ERRORS.MISSING.TYPE}`);
        }
      });
      if (structureErrors.length != 0) {
        const exception = new CustomBadRequestException(ERRORS.MISSING.CODE, ERRORS.MISSING.DESCRIPTION, structureErrors);
        return exception.toHttpException(response);
      }
      const activityCapayor = new ActivityCapayorDto(activityCapayorDto);
      const percentageValide = this.activityCapayorService.percentageValidation(activityCapayor.getCapayorPercentages());
      if (!percentageValide) {
        const exception = new CustomBadRequestException(ERRORS.PERCENTAGE_KO.CODE, ERRORS.PERCENTAGE_KO.DESCRIPTION);
        return exception.toHttpException(response);
      }
      const result = await this.activityCapayorService.linkActivityTocapayor(activityCapayor);
      if (result == ERRORS.ACTIVITY_NOT_FOUND) {
        const exception = new CustomBadRequestException(ERRORS.ACTIVITY_NOT_FOUND.CODE, ERRORS.ACTIVITY_NOT_FOUND.DESCRIPTION);
        return exception.toHttpException(response);
      }
      if (result == ERRORS.CAPAYOR_NOT_FOUND) {
        const exception = new CustomBadRequestException(ERRORS.CAPAYOR_NOT_FOUND.CODE, ERRORS.CAPAYOR_NOT_FOUND.DESCRIPTION);
        return exception.toHttpException(response);
      }
      if (result == SUCCESS.CREATE) {
        return response.status(SUCCESS.CREATE.STATUS).json(SUCCESS.CREATE);
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  @Get('get-capayorparty/:id')
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: SUCCESS.OK.DESCRIPTION,
    isArray: true,
    type: ActivityCapayor,
  })
  @ApiResponse({
    status: SUCCESS.NOCONTENT.STATUS,
    description: SUCCESS.NOCONTENT.DESCRIPTION,
    isArray: false,
    type: ActivityCapayor,
  })
  async getcapayorParty(@Param('id') id: number): Promise<any> {
    const optionsActivity = {
      where: {
        id,
      },
    };
    const activity = await this.activityService.findOne(optionsActivity);
    const options = {
      relations: ['capayor', 'activity'],
      where: {
        activity,
      },
    };
    return await this.activityCapayorService.find(options);
  }
  /*
  @Get('delete-capayorparty/:id')
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: SUCCESS.OK.DESCRIPTION,
    isArray: true,
    type: capayorParty,
  })
  @ApiResponse({
    status: SUCCESS.NOCONTENT.STATUS,
    description: SUCCESS.NOCONTENT.DESCRIPTION,
    isArray: false,
    type: capayorParty,
  })
  async deletecapayorParty(@Param('id') id: number): Promise<any> {
    return await this.activityCapayorService.deletecapayorPartyRepository(id);
  }

  @Get('update-capayorparty/:id/:percent')
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: SUCCESS.OK.DESCRIPTION,
    isArray: true,
    type: capayorParty,
  })
  @ApiResponse({
    status: SUCCESS.NOCONTENT.STATUS,
    description: SUCCESS.NOCONTENT.DESCRIPTION,
    isArray: false,
    type: capayorParty,
  })
  async updatecapayorParty(@Param('id') id: number, @Param('percent') percent: number): Promise<any> {
    return await this.activityCapayorService.update(id, percent);
  }
  */
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'multipart/form-data')
  @Header('Accept-Charset', 'utf-8')
  @ApiOperation({
    description: 'add activity partners with percentage',
    operationId: 'POST /capayorparty/upload',
  })
  @ApiResponse({
    status: SUCCESS.CREATE.STATUS,
    description: 'activity partners created',
    isArray: true,
    type: ActivityCapayor,
  })
  @ApiResponse({
    status: SUCCESS.OK.STATUS,
    description: 'activity partners updated',
    isArray: true,
    type: ActivityCapayor,
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
      .map(activityCapayor => {
        const { activity, startDate, endDate } = activityCapayor[0];
        return {
          activity,
          capyorPercentages: activityCapayor.map(({ capayor, percentage }) => ({
            capayor,
            percentage,
            startDate,
            endDate,
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

        const activityCapayor: ActivityCapayorInterface = {
          activity: parseInt(activity),
          capayorPercentages: thirdPartyPercentages.map(({ thirdParty, percentage }) => ({
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            thirdParty,
            percent: parseInt(percentage),
          })),
        };

        const activityCapayorDto: ActivityCapayorDto = new ActivityCapayorDto(activityCapayor);

        //functionnal check
        if (!this.activityCapayorService.percentageValidation(activityCapayorDto.getCapayorPercentages())) throw ERRORS.PERCENTAGE_KO.DESCRIPTION;

        //add
        const result = await this.activityCapayorService.linkActivityTocapayor(activityCapayorDto);

        switch (result) {
          case ERRORS.ACTIVITY_NOT_FOUND:
            throw ERRORS.ACTIVITY_NOT_FOUND.DESCRIPTION;
          case ERRORS.CAPAYOR_NOT_FOUND:
            throw ERRORS.CAPAYOR_NOT_FOUND.DESCRIPTION;
          default:
            break;
        }
      } catch (error) {
        for (const { thirdpartyTrigram, percentage } of thirdPartyPercentages) {
          errors.push({
            activity,
            endDate,
            startDate,
            thirdpartyTrigram,
            percentage,
            error,
          });
        }
      }
    }

    return response.status(SUCCESS.CREATE.STATUS).json({ ...SUCCESS.CREATE, rejectedLines: errors });
  }
}
