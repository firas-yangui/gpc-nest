import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAndCountInterface } from './../interfaces/common-interfaces';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email }, relations: ['thirdParty', 'maxReadThirdParty', 'maxEditThirdParty'] });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findOrCreateUser(email: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    const userId = null;
    if (user) {
      user.id = userId;
    }
    return user;
  }

  async findAndCount(): Promise<FindAndCountInterface<User, number>> {
    return await this.userRepository.findAndCount();
  }
}
