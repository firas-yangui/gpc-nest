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
}
