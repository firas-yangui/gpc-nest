import { Controller, Get, Logger, Post, Body, Res } from '@nestjs/common';
import { MappingCaPayorService } from './mappingcapayor.service';
import { ApiTags } from '@nestjs/swagger';

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
}
