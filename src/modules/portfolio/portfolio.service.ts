import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioRepository } from './portfolio.repository';
import { Portfolio } from './portfolio.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioRepository)
    private portfolioRepository: PortfolioRepository,
  ) {}

  async findOne(options: object = {}): Promise<Portfolio> {
    return await this.portfolioRepository.findOne(options);
  }
}
