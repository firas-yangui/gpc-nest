import { Controller } from '@nestjs/common';
import { IrtApplicationService } from './irtapplication.service';
@Controller('services')
export class IrtApplicationController {
  constructor(private irtApplicationService: IrtApplicationService) {}
}
