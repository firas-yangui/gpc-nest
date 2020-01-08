import { Module } from '@nestjs/common';
import { SubnatureController } from './subnature.controller';
import { SubnatureService } from './subnature.service';

@Module({
  controllers: [SubnatureController],
  providers: [SubnatureService]
})
export class SubnatureModule {}
