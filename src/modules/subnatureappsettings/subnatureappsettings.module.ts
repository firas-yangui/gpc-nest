import { Module } from '@nestjs/common';
import { SubnatureappsettingsController } from './subnatureappsettings.controller';
import { SubnatureappsettingsService } from './subnatureappsettings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubNatureAppSettingsRepository } from './subnatureappsettings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubNatureAppSettingsRepository])],
  controllers: [SubnatureappsettingsController],
  providers: [SubnatureappsettingsService],
  exports: [SubnatureappsettingsService],
})
export class SubnatureappsettingsModule {}
