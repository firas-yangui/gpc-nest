import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeMessage } from './homeMessage.entity';
import { HomeMessageRepository } from './homeMessage.repository';

@Injectable()
export class HomeMessageService {
  constructor(@InjectRepository(HomeMessageRepository) private readonly homeMessageRepository: HomeMessageRepository) {}

  public async getLatest(perimeter: number): Promise<HomeMessage[]> {
    try {
      const homeMessage = await this.homeMessageRepository.find({
        where: {
          gpcappsettings: {
            id: perimeter,
          },
        },
        order: {
          id: 'DESC',
        },
        take: 1,
        relations: ['gpcappsettings'],
      });

      if (!homeMessage) {
        throw new NotFoundException(`Home message not found`);
      }
      return homeMessage;
    } catch (error) {
      Logger.log(error);
    }
  }
}
