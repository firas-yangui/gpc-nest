import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { SubService } from '../subservices/subservice.entity';
import { ServiceDto } from './services.entity';
import { ServicesService } from './services.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('services')
@ApiTags('Services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get() // TO BE REMOVED : REPLACED BY findByGpcAppSettingsId
  async findAll(@Query() query): Promise<ServiceDto[]> {
    return await this.servicesService.find(query);
  }

  @Get('/byGpcAppSettingsId/:gpcAppSettingsId')
  @ApiResponse({
    status: 200,
    description: 'Return all services for by gpcAppSettingsId',
    type: ServiceDto,
    isArray: true,
  })
  async findByGpcAppSettingsId(@Param('gpcAppSettingsId') gpcAppSettingsId: number): Promise<ServiceDto[]> {
    return await this.servicesService.find({ gpcAppSettingsId });
  }

  @Get('/with-amount')
  async getServicesWithAmounts(@Query() query): Promise<any> {
    return await this.servicesService.getServicesWithAmounts(query);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return all thirdparties',
    type: ServiceDto,
    isArray: false,
  })
  findById(@Param('id') id: number): Promise<ServiceDto> {
    return this.servicesService.findOne({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }

  @Get(':id/getSubservices')
  getSubServices(@Param('id') id: number): Promise<SubService[]> {
    return this.servicesService.getSubservices({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }
}
