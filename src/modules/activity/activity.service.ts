import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityRepository } from './activity.repository';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityRepository)
    private readonly activityRepository: ActivityRepository,
  ) {}
  private readonly logger = new Logger(ActivityService.name);

  async findOne(options: Record<string, any> = {}): Promise<Activity> {
    return this.activityRepository.findOne(options);
  }

  async find(options: Record<string, any> = {}): Promise<Activity[]> {
    return await this.activityRepository.find(options);
  }

  save = async (activity: Record<string, any> = {}): Promise<Activity> => {
    return this.activityRepository.save(activity);
  };
}
