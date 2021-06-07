import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('amounts')
@ApiTags('amount')
export class AmountsController {}
