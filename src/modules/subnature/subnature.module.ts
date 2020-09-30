import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubnatureController } from './subnature.controller';
import { SubnatureService } from './subnature.service';
import { SubNatureRepository } from './subnature.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubNatureRepository])],
  controllers: [SubnatureController],
  providers: [SubnatureService],
  exports: [SubnatureService],
})
export class SubnatureModule {}
