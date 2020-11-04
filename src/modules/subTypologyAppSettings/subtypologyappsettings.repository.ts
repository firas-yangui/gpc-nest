import { SubTypologyAppSettings } from './subtypologyappsettings.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(SubTypologyAppSettings)
export class SubtypologyAppSettingsRepository extends Repository<SubTypologyAppSettings> {}
