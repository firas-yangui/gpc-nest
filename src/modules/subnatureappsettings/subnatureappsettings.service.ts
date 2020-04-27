import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubNatureAppSettingsRepository } from './subnatureappsettings.repository';
import { Subnatureappsetting } from './../interfaces/common-interfaces';
import { SubNatureAppSettings } from './subnatureappsettings.entity';

@Injectable()
export class SubnatureappsettingsService {
  constructor(
    @InjectRepository(SubNatureAppSettingsRepository)
    private subNatureAppSettingsRepository: SubNatureAppSettingsRepository,
  ) {}

  async find(options: object = {}): Promise<SubNatureAppSettings[]> {
    return await this.subNatureAppSettingsRepository.find(options);
  }

  async findOne(options: object = {}): Promise<SubNatureAppSettings> {
    return await this.subNatureAppSettingsRepository.findOne(options);
  }
}
