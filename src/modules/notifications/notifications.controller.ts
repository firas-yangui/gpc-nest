import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {}
