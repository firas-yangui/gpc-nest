import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(@InjectRepository(TransactionRepository) private transactionRepository: TransactionRepository) {}

  public async getAll() {
    return await this.transactionRepository.find({
      relations: ['subService', 'sender', 'receiver', 'targetThirdParty', 'transactionWorkloads', 'transactionWorkloads.workload'],
    });
  }

  public async getAllWithUserId(userId: number) {
    return await this.transactionRepository.find({
      relations: ['subService', 'sender', 'receiver', 'targetThirdParty', 'transactionWorkloads', 'transactionWorkloads.workload'],
      where: {
        receiver: {
          id: userId,
        },
      },
    });
  }

  public async getLatestTransactions(count = 6) {
    return await this.transactionRepository.find({
      order: {
        id: 'DESC',
      },
      take: count,
    });
  }
}
