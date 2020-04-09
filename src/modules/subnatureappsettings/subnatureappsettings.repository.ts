import { SubNatureAppSettings } from './subnatureappsettings.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(SubNatureAppSettings)
export class SubNatureAppSettingsRepository extends Repository<SubNatureAppSettings> {}
