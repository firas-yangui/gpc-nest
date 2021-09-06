import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityThirdPartyController } from './activity-thirdparty.controller';
import { ActivityThirdPartyService } from './activity-thirdparty.service';
import { ActivityThirdPartyRepository } from '../activity-thirdparty/activity-thirdparty.repository';
import { ActivitModule } from '../activity/activity.module';
import { ThirdpartiesModule } from '../thirdparties/thirdparties.module';
import { ConstantsModule } from '../constants/constants.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityThirdPartyRepository]), ActivitModule, ThirdpartiesModule, ConstantsModule],
  controllers: [ActivityThirdPartyController],
  providers: [ActivityThirdPartyService],
  exports: [ActivityThirdPartyService],
})
export class ActivityThirdPartyModule {}
