import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubtypologyAppSettingsRepository } from './subtypologyappsettings.repository';
import { SubTypologyAppSettings } from './subtypologyappsettings.entity';

@Injectable()
export class SubtypologyAppSettingsService {
  constructor(
    @InjectRepository(SubtypologyAppSettingsRepository)
    private subtypologyAppSettingsRepository: SubtypologyAppSettingsRepository,
  ) {}

  async findOne(options: object = {}): Promise<SubTypologyAppSettings> {
    return await this.subtypologyAppSettingsRepository.findOne(options);
  }
}
