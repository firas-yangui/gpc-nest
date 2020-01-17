import { Module } from '@nestjs/common';
import { SubtypologiesController } from './subtypologies.controller';
import { SubtypologiesService } from './subtypologies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubtypologyRepository } from './subtypologies.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubtypologyRepository])],
  controllers: [SubtypologiesController],
  providers: [SubtypologiesService],
  exports: [SubtypologiesService],
})
export class SubtypologiesModule {}
