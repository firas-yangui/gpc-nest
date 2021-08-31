import { Get, Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { CaPayorService } from './capayor.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('capayor')
@ApiTags('ca-payor')
export class CaPayorController {
  constructor(private readonly caPayorService: CaPayorService) {}

  @Get()
  async getCaPayor() {
    try {
      return await this.caPayorService.getCaPayor();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  @Post()
  async setCaPayor(@Body() { newCaPayor }: any) {
    try {
      return await this.caPayorService.setCaPayor(newCaPayor);
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  @Get('/export')
  async exportCaPayor(@Res() response: Response): Promise<any> {
    return await this.caPayorService.exportCaPayor(response);
  }
}
