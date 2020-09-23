import { PeriodAppSettings } from './periodappsettings.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(PeriodAppSettings)
export class PeriodAppSettingsRepository extends Repository<PeriodAppSettings> {}
