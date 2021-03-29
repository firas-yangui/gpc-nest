import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeMessageRepository } from './homeMessage.repository';
import { HomeMessageDto } from './homeMessage.dto';
import { HomeMessageEntity } from './homeMessage.entity';

@Injectable()
export class HomeMessageService {
  constructor(@InjectRepository(HomeMessageRepository) private readonly homeMessageRepository: HomeMessageRepository) {}

  async getLatest(perimeter: number): Promise<HomeMessageEntity> {
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
      return homeMessage[0];
    } catch (error) {
      Logger.log(error);
    }
  }

  async create(homeMessageDto: HomeMessageDto): Promise<HomeMessageEntity> {
    const data = { message: homeMessageDto.message, gpcappsettings: { id: homeMessageDto.perimeterId } };
    const newMessage = await this.homeMessageRepository.save(data, { data: { userId: 244 } });
    return newMessage;
  }
}
