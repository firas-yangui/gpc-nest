import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityCapayorController } from './activity-capayor.controller';
import { ActivityCapayorService } from './activity-capayorservice';
import { ActivityCapayorRepository } from '../activity-capayor/activity-capayor.repository';
import { ActivitModule } from '../activity/activity.module';
import { ThirdpartiesModule } from '../thirdparties/thirdparties.module';
import { ConstantsModule } from '../constants/constants.module';
import { CaPayorModule } from '../capayor/capayor.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityCapayorRepository]), ActivitModule, ThirdpartiesModule, ConstantsModule, CaPayorModule],
  controllers: [ActivityCapayorController],
  providers: [ActivityCapayorService],
  exports: [ActivityCapayorService],
})
export class ActivitycapayorModule {}
