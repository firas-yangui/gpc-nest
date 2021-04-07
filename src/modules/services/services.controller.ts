import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { SubService } from '../subservices/subservice.entity';
import { Service } from './services.entity';
import { ServicesService } from './services.service';
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  async findAll(@Query() query): Promise<Service[]> {
    return await this.servicesService.find(query);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Service> {
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
