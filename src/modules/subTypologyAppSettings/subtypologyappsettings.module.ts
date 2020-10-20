import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubtypologyAppSettingsRepository } from './subtypologyappsettings.repository';
import { SubTypologyAppSettings } from './subtypologyappsettings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubtypologyAppSettingsRepository])],
  controllers: [],
  providers: [SubTypologyAppSettings],
  exports: [SubTypologyAppSettings],
})
export class SubtypologyAppSettingsModule {}
