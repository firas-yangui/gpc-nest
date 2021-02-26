import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { SubService } from './subservice.entity';
import { SubservicesService } from './subservices.service';

@Controller('subservices')
export class SubservicesController {
  constructor(private subservicesService: SubservicesService) {}

  @Get()
  findAll(): Promise<SubService[]> {
    return this.subservicesService.find({});
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<SubService> {
    return this.subservicesService.findOne({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }

  @Get(':id/getSubservices')
  getSubServices(@Param('id') id: number): Promise<SubService[]> {
    return this.subservicesService.getWorkloads({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }
}
