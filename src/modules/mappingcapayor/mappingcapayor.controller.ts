import { Get, Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { MappingCaPayorService } from './mappingcapayor.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('mapping-ca-payor')
@ApiTags('mapping-ca-payor')
export class MappingCaPayorController {
  constructor(private readonly MappingCaPayorService: MappingCaPayorService) {}

  @Get()
  async getMappingCaPayor() {
    try {
      return await this.MappingCaPayorService.getMappingCaPayor();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  @Post()
  async setMappingCaPayor(@Body() { newMappingCaPayor }: any) {
    try {
      return await this.MappingCaPayorService.setMappingCaPayor(newMappingCaPayor);
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  @Get('/export')
  async exportMappingCaPayor(@Res() response: Response): Promise<any> {
    return await this.MappingCaPayorService.exportMappingCaPayor(response);
  }
}
