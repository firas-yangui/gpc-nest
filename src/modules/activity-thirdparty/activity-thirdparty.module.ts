import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityThirdPartyController } from './activity-thirdparty.controller';
import { ActivityThirdPartyService } from './activity-thirdparty.service';
import { ActivityThirdPartyRepository } from '../activity-thirdparty/activity-thirdparty.repository';
@Module({
  imports: [TypeOrmModule.forFeature([ActivityThirdPartyRepository])],
  controllers: [ActivityThirdPartyController],
  providers: [ActivityThirdPartyService],
  exports: [ActivityThirdPartyService],
})
export class ActivityThirdPartyModule {}
